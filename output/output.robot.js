/*jshint node:true jquery:true*/
"use strict";

module.exports = function(output) {
	var robot = require('../robot');
	var clayer = require('../clayer');
	var blockSize = 64;

	output.Robot = function() { return this.init.apply(this, arguments); };
	output.Robot.prototype = {
		init: function($div, editor, readOnly, columns, rows) {
			this.$div = $div;
			this.$div.addClass('output robot');
			this.readOnly = readOnly || false;

			this.$container = $('<div class="robot-not-highlighting"></div>');
			this.$container.on('mouseup', $.proxy(this.containerMouseUp, this));
			this.$container.on('mouseleave', $.proxy(this.containerMouseLeave, this));
			this.$div.append(this.$container);
			this.robot = new robot.Robot(this.$container, this.readOnly, blockSize, columns || 8, rows || 8);

			this.highlighting = false;
			this.stateChangedCallback = null;

			if (!this.readOnly) {
				this.robot.$initial.on('mousedown', $.proxy(this.initialMouseDown, this));
				this.robot.$initial.on('mouseup', $.proxy(this.initialMouseUp, this));
				this.updateInterface();
			}

			this.editor = editor;
		},

		remove: function() {
			this.robot.remove();
			this.$div.removeClass('output robot');
		},

		drive: function(context, name, args) {
			var amount = 1;
			if (args[0] !== undefined) {
				amount = args[0];
			}

			if (args.length > 1) {
				throw '<var>forward</var> accepts no more than <var>1</var> argument';
			} else if (typeof amount !== 'number' || !isFinite(amount)) {
				throw 'Argument has to be a valid number';
			} else if (Math.round(amount) !== amount && this.robot.mazeObjects > 0) {
				throw 'Fractional amounts are only allowed when the maze is empty';
			} else if (amount !== 0) {
				try {
					this.robot.drive(amount);
				} catch (error) {
					this.addCall(context);
					throw error;
				}
				this.addCall(context);
			}
		},

		turn: function(context, name, args) {
			var amount = 90;
			if (args[0] !== undefined) {
				amount = args[0];
			}

			if (args.length > 1) {
				throw '<var>' + name + '</var> accepts no more than <var>1</var> argument';
			} else if (typeof amount !== 'number' || !isFinite(amount)) {
				throw 'Argument has to be a valid number';
			} else if ([0, 90, 180, 270].indexOf((amount%360+360)%360) < 0 && this.robot.mazeObjects > 0) {
				throw 'Only <var>90</var>, <var>180</var> and <var>270</var> degrees are allowed when the maze is not empty';
			} else {
				this.robot[name](amount);
				this.addCall(context);
			}
		},

		detectWall: function(context, name, args) {
			var wall = this.robot.detectWall();
			this.addCall(context);
			return wall;
		},

		detectGoal: function(node, name, args) {
			return this.robot.detectGoal();
		},
		
		getAugmentedObject: function() {
			return {
				type: 'object',
				string: '[object robot]',
				properties: {
					drive: {
						name: 'drive',
						info: 'robot.drive',
						type: 'function',
						example: 'drive(3)',
						string: '[function robot.drive]',
						func: $.proxy(this.drive, this),
						cost: 0.7
					},
					turnLeft: {
						name: 'turnLeft',
						info: 'robot.turnLeft',
						type: 'function',
						example: 'turnLeft()',
						string: '[function robot.turnLeft]',
						func: $.proxy(this.turn, this),
						cost: 0.7
					},
					turnRight: {
						name: 'turnRight',
						info: 'robot.turnRight',
						type: 'function',
						example: 'turnRight()',
						string: '[function robot.turnRight]',
						func: $.proxy(this.turn, this),
						cost: 0.7
					},
					detectWall: {
						name: 'detectWall',
						info: 'robot.detectWall',
						type: 'function',
						example: 'detectWall()',
						string: '[function robot.detectWall]',
						func: $.proxy(this.detectWall, this),
						cost: 0.2
					},
					detectGoal: {
						name: 'detectGoal',
						info: 'robot.detectGoal',
						type: 'function',
						example: 'detectGoal()',
						string: '[function robot.detectGoal]',
						func: $.proxy(this.detectGoal, this),
						cost: 0.2
					}
				}
			};
		},

		outputStartEvent: function(context) {
			var event = {
				robotX: this.robot.robotX,
				robotY: this.robot.robotY,
				robotAngle: this.robot.robotAngle,
				startAnimNum: this.robot.animation.animationQueue.length,
				endAnimNum: this.robot.animation.animationQueue.length,
				calls: []
			};
			this.eventPosition = this.events.length;
			this.events.push(event);
		},

		outputEndEvent: function() {
			this.updateEventHighlight();
			this.robot.animationManager.play(this.events[this.eventPosition].startAnimNum, this.events[this.eventPosition].endAnimNum);
		},

		outputClearAllEvents: function() {
			this.robot.clear();
			this.eventStart = 0;
			this.eventPosition = 0;
			this.events = [];
			this.callCounter = 0;
		},

		outputPopFirstEvent: function() {
			this.eventStart++;
		},

		outputClearEventsFrom: function(eventNum) {
			var position = this.eventStart+eventNum;
			this.robot.robotX = this.events[position].robotX;
			this.robot.robotY = this.events[position].robotY;
			this.robot.robotAngle = this.events[position].robotAngle;
			for (var i=position; i<this.events.length; i++) {
				for (var j=0; j<this.events[i].calls.length; j++) {
					var call = this.events[i].calls[j];
					this.callCounter--;
					if (call.$element !== null) {
						call.$element.remove();
					}
				}
			}
			this.robot.animation.removeFromAnimNum(this.events[position].startAnimNum+1);
			this.events = this.events.slice(0, position);
		},

		outputClearEventsToEnd: function() {
			this.eventStart = this.events.length;
		},

		outputSetError: function(error) {
			if (error) {
				this.$container.addClass('robot-error');
				this.robot.stop();
			} else {
				this.$container.removeClass('robot-error');
			}
		},

		outputSetEventStep: function(eventNum, stepNum) {
			this.eventPosition = this.eventStart + eventNum;
			this.stepNum = stepNum;

			this.robot.$path.children('.robot-path-line, .robot-path-point').addClass('robot-path-hidden');
			for (var i=0; i<this.events.length; i++) {
				if (i > this.eventPosition) break;
				for (var j=0; j<this.events[i].calls.length; j++) {
					var call = this.events[i].calls[j];
					if (i === this.eventPosition && call.stepNum > this.stepNum) break;

					if (call.$element !== null) {
						call.$element.removeClass('robot-path-hidden');
					}
				}
			}

			if (this.stepNum === Infinity) {
				this.robot.animationManager.play(this.events[this.eventPosition].startAnimNum, this.events[this.eventPosition].endAnimNum);
			} else {
				var lastAnimNum = null;
				for (var i=0; i<this.events[this.eventPosition].calls.length; i++) {
					var call = this.events[this.eventPosition].calls[i];
					if (call.stepNum > this.stepNum) break;

					if (call.stepNum === this.stepNum) {
						this.robot.animationManager.play(call.animNum, call.animNum+1);
						lastAnimNum = false;
						break;
					} else {
						lastAnimNum = call.animNum;
					}
				}

				if (lastAnimNum === null) {
					this.robot.animationManager.play(this.events[this.eventPosition].startAnimNum, this.events[this.eventPosition].startAnimNum);
				} else if (lastAnimNum !== false) {
					this.robot.animationManager.play(lastAnimNum+1, lastAnimNum+1);
				}
			}
		},

		enableHighlighting: function() {
			this.highlighting = true;
			this.$container.removeClass('robot-not-highlighting');
			this.$container.addClass('robot-highlighting');
			this.updateEventHighlight();
		},

		disableHighlighting: function() {
			this.highlighting = false;
			this.$container.removeClass('robot-highlighting');
			this.$container.addClass('robot-not-highlighting');
			this.robot.removeEventHighlights();
			this.robot.removePathHighlights();
		},

		updateEventHighlight: function() {
			this.robot.removeEventHighlights();
			if (this.highlighting) {
				for (var i=0; i<this.events[this.eventPosition].calls.length; i++) {
					var call = this.events[this.eventPosition].calls[i];
					if (call.$element !== null) {
						call.$element.addClass('robot-path-highlight-event');
					}
				}
			}
		},

		highlightCallIds: function(callIds) {
			this.robot.removePathHighlights();
			if (callIds !== null) {
				for (var i=0; i<this.events[this.eventPosition].calls.length; i++) {
					var call = this.events[this.eventPosition].calls[i];
					if (callIds.indexOf(call.callId) >= 0 && call.$element !== null) {
						call.$element.addClass('robot-path-highlight');
					}
				}
			}
		},

		highlightTimeIds: function(timeIds) {
			this.robot.removeTimeHighlights();
			if (timeIds !== null) {
				for (var i=this.eventStart; i<this.events.length; i++) {
					for (var j=0; j<this.events[i].calls.length; j++) {
						var call = this.events[i].calls[j];

						if (timeIds[i-this.eventStart].indexOf(call.callId) >= 0 && call.$element !== null) {
							call.$element.addClass('robot-path-highlight-time');
						}
					}
				}
			}
		},

		setState: function(state) {
			this.robot.setState(state);
			this.updateInterface();
		},

		setStateChangedCallback: function(callback) {
			this.stateChangedCallback = callback;
		},

		getVisitedGoals: function() {
			return this.robot.visitedGoals;
		},

		highlightVisitedGoal: function(goal) {
			this.robot.highlightVisitedGoal(goal);
		},

		getMouseElement: function() {
			//return this.$container;
			return null; // no support for now
		},

		/// INTERNAL FUNCTIONS ///
		addCall: function(context) {
			if (this.callCounter++ > 300) {
				context.throwTimeout();
			}
			var $element = this.robot.$lastElement;
			if ($element !== null) {
				$element.data('eventPosition', this.eventPosition);
				$element.data('index', this.events[this.eventPosition].calls.length);
				$element.on('mousemove', $.proxy(this.pathMouseMove, this));
				$element.on('mouseleave', $.proxy(this.pathMouseLeave, this));
			}
			this.events[this.eventPosition].calls.push({
				stepNum: context.getStepNum(),
				nodeId: context.getCallNodeId(),
				callId: context.getCallId(),
				$element: $element,
				animNum: this.robot.animation.getLength()-1
			});
			this.events[this.eventPosition].endAnimNum = this.robot.animation.getLength();
		},

		updateInterface: function() {
			if (!this.readOnly) {
				$('.robot-maze-block').click($.proxy(this.clickBlock, this));
				$('.robot-maze-line-vertical').click($.proxy(this.clickVerticalLine, this));
				$('.robot-maze-line-horizontal').click($.proxy(this.clickHorizontalLine, this));
			}
		},

		clickVerticalLine: function(event) {
			var $target = $(event.delegateTarget);
			var active = !this.robot.verticalActive[$target.data('x')][$target.data('y')];
			this.robot.verticalActive[$target.data('x')][$target.data('y')] = active;
			if (active) {
				this.robot.mazeObjects++;
				$target.addClass('robot-maze-line-active');
			} else {
				this.robot.mazeObjects--;
				$target.removeClass('robot-maze-line-active');
			}
			this.stateChanged();
		},

		clickHorizontalLine: function(event) {
			var $target = $(event.delegateTarget);
			var active = !this.robot.horizontalActive[$target.data('x')][$target.data('y')];
			this.robot.horizontalActive[$target.data('x')][$target.data('y')] = active;
			if (active) {
				this.robot.mazeObjects++;
				$target.addClass('robot-maze-line-active');
			} else {
				this.robot.mazeObjects--;
				$target.removeClass('robot-maze-line-active');
			}
			this.stateChanged();
		},

		pathMouseMove: function(event) {
			if (this.highlighting) {
				var $target = $(event.delegateTarget);
				if ($target.data('eventPosition') === this.eventPosition &&
						this.events[this.eventPosition].calls[$target.data('index')] !== undefined) {
					if (!$target.hasClass('robot-path-highlight')) {
						this.robot.removePathHighlights();
						$target.addClass('robot-path-highlight');
						this.editor.highlightNodeId(this.events[this.eventPosition].calls[$target.data('index')].nodeId);
					}
				} else {
					this.robot.removePathHighlights();
					this.editor.highlightNodeId(0);
				}
			}
		},

		pathMouseLeave: function(event) {
			if (this.highlighting) {
				this.robot.removePathHighlights();
				this.editor.highlightNodeId(0);
			}
		},

		initialMouseDown: function(event) {
			var offset = this.$container.offset();
			if (!this.draggingInitial) {
				this.draggingInitial = true;
				this.dragX = (event.pageX - offset.left)%blockSize - blockSize/2;
				this.dragY = (event.pageY - offset.top)%blockSize - blockSize/2;
				this.$container.on('mousemove', $.proxy(this.containerMouseMove, this));
				this.robot.$initial.addClass('robot-initial-dragging');
				event.preventDefault();
			}
		},

		containerMouseUp: function(event) {
			if (this.draggingInitial) {
				this.$container.off('mousemove');
				this.robot.$initial.removeClass('robot-initial-dragging');
				this.draggingInitial = false;
				this.robot.drawInitial();
			}
		},

		containerMouseLeave: function(event) {
			if (this.draggingInitial) {
				this.$container.off('mousemove');
				this.robot.$initial.removeClass('robot-initial-dragging');
				this.draggingInitial = false;
				this.robot.drawInitial();
			}
		},

		containerMouseMove: function(event) {
			var offset = this.$container.offset();
			var x = Math.floor((event.pageX - offset.left)/blockSize);
			var y = Math.floor((event.pageY - offset.top)/blockSize);

			if (x !== this.robot.initialX || y !== this.robot.initalY) {
				this.robot.initialX = x;
				this.robot.initialY = y;
				this.stateChanged();
			}
			this.robot.$initial.css('left', event.pageX - offset.left - this.dragX);
			this.robot.$initial.css('top', event.pageY - offset.top - this.dragY);
		},

		clickBlock: function(event) {
			var $target = $(event.delegateTarget);
			var goal = !this.robot.blockGoal[$target.data('x')][$target.data('y')];
			this.robot.blockGoal[$target.data('x')][$target.data('y')] = goal;
			if (goal) {
				this.robot.mazeObjects++;
				$target.addClass('robot-maze-block-goal');
			} else {
				this.robot.mazeObjects--;
				$target.removeClass('robot-maze-block-goal');
			}
			this.stateChanged();
		},

		stateChanged: function() {
			this.editor.outputRequestsRerun();
			if (this.stateChangedCallback !== null) {
				this.stateChangedCallback(this.robot.getState());
			}
		}
	};
};