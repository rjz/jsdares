/*jshint node:true jquery:true*/
"use strict";

var jsmm = require('../jsmm');
var editor = require('../editor');
var dares = require('../dares');
var info = require('../info');

module.exports = function(output) {
	output.UI = function() { return this.init.apply(this, arguments); };

	output.Document = function() { return this.init.apply(this, arguments); };

	output.Document.prototype = {
		init: function(editor) {
			this.onkeydown = null;
			this.contexts = [];
			$(document).on('keydown', $.proxy(this.handleKeyDownEvent, this));

			this.editor = editor;
			this.editor.addOutput(this);
			this.editor.addInput(this);
		},

		getAugmentedObject: function() {
			return {
				onkeydown: {
					name: 'onkeydown',
					info: 'document.onkeydown',
					type: 'variable',
					example: 'onkeydown("Hello World!")',
					get: $.proxy(this.handleAttributeGet, this),
					set: $.proxy(this.handleAttributeSet, this)
				}
			};
		},

		handleAttributeGet: function(name) {

		},

		handleAttributeSet: function(context, name, value) {
			this.onkeydown = value.name;
			this.editor.makeInteractive();
		},

		handleKeyDownEvent: function(event) {
			// 17 == CTRL, 18 == ALT, (17, 91, 93, 224) == COMMAND
			// block these as they are only keyboard shortcuts
			if ([17, 18, 91, 93, 224].indexOf(event.keyCode) >= 0) {
				return;
			}
			
			var e = {
				keyCode: event.keyCode
			};
			if (this.onkeydown !== null) {
				this.editor.addEvent(this.onkeydown, [e]);
			}
		}
	};

	output.UI.prototype = {
		icons: {dare: 'icon-file', console: 'icon-list-alt', canvas: 'icon-picture', robot: 'icon-th', info: 'icon-info-sign'},

		init: function() {
			this.editor = this.robot = this.console = this.canvas = this.info = this.dare = null;

			this.$main = $('#main');
			this.initTabs();
			this.loadInitial();

			this.dares = new dares.Dares($('#dares-popup'), dares.getContent(this));

			$('#start-dare, #switch-dare').click($.proxy(function() {
				this.dares.show();
			}, this));

			$('#abort-dare').click($.proxy(function() {
				this.loadInitial();
			}, this));
		},

		initTabs: function() {
			this.$output = $('#output');
			this.$output.addClass('tabbable');
			this.$tabs = $('<ul class="nav nav-tabs"></ul>');
			this.$output.append(this.$tabs);
			this.$content = $('<div class="tab-content">');
			this.$output.append(this.$content);
		},

		removeAll: function() {
			if (this.robot !== null) {
				this.robot.remove();
				this.robot = null;
			}
			if (this.console !== null) {
				this.console.remove();
				this.console = null;
			}
			if (this.canvas !== null) {
				this.canvas.remove();
				this.canvas = null;
			}
			if (this.info !== null) {
				this.info.remove();
				this.info = null;
			}
			if (this.dare !== null) {
				this.dare.remove();
				this.dare = null;
			}
			if (this.editor !== null) {
				this.editor.remove();
				this.editor = null;
			}
			this.scope = {};
			this.$tabs.children('li').remove();
			this.$content.children('div').remove();
			this.$main.removeClass('ui-dares-active');
			this.tabs = [];
		},

		addTab: function(name) {
			var $tab = $('<li id="tab-button-' + name + '"><a href="#tab-' + name + '" id="tab-link-' + name + '"><i class="' + this.icons[name] + ' icon-white"></i> ' + name + '</a></li>');
			setTimeout(function() { $tab.addClass('tab-button-enabled'); }, 50*this.tabs.length);
			this.$tabs.append($tab);

			var $pane = $('<div class="tab-pane" id="tab-' + name + '"><div id="' + name + '" class="tab-output"></div></div>');
			this.$content.append($pane);

			$('#tab-link-' + name).click($.proxy(function(event) {
				event.preventDefault();
				this.selectTab(name);
			}, this));

			if (this.tabs.length === 0) {
				$pane.addClass('active');
			}

			this.tabs.push(name);
		},

		addEditor: function() {
			this.editor = new editor.Editor(jsmm, $('#editor'), $('#editor-bar'));
			return this.editor;
		},

		addRobot: function(readOnly, width, height) {
			this.addTab('robot');
			this.robot = new output.Robot($('#robot'), this.editor, readOnly, width, height);
			this.scope.robot = this.robot.getAugmentedObject();
			this.editor.setScope(this.scope);
			return this.robot;
		},

		addConsole: function() {
			this.addTab('console');
			this.console = new output.Console($('#console'), this.editor);
			this.scope.console = this.console.getAugmentedObject();
			this.editor.setScope(this.scope);
			return this.console;
		},

		addCanvas: function(size) {
			this.addTab('canvas');
			this.canvas = new output.Canvas($('#canvas'), this.editor, size || 540);
			this.scope.canvas = this.canvas.getAugmentedObject();
			this.editor.setScope(this.scope);
			return this.canvas;
		},

		addInfo: function(commandFilter) {
			this.addTab('info');
			this.info = new info.Info($('#info'), this.editor, commandFilter);
			return this.robot;
		},

		addDare: function(dare) {
			this.addTab('dare');
			this.dare = dare;
			dare.makeActive($('#dare'), this);
			this.$main.addClass('ui-dares-active');
			return this.dare;
		},

		finish: function() {
			this.selectTab(this.tabs[0]);
		},

		selectTab: function(name) {
			this.$content.children('.active').removeClass('active');
			this.$tabs.children('ul li.active').removeClass('active');
			$('#tab-button-' + name).addClass('active');
			$('#tab-' + name).addClass('active');
			if (this[name].setFocus !== undefined) this[name].setFocus();
		},

		loadInitial: function() {
			this.removeAll();
			this.addEditor();
			//this.addRobot();
			this.addConsole();
			this.addCanvas();
			this.addInfo();

			this.document = new output.Document(this.editor);
			this.scope.document = this.document.getAugmentedObject();
			this.editor.setScope(this.scope);
			/*
			if (window.localStorage.getItem('initial-robot') !== null) {
				this.robot.setState(window.localStorage.getItem('initial-robot'));
			}
			this.robot.setStateChangedCallback(function(state) {
				window.localStorage.setItem('initial-robot', state);
			});
			*/
			this.editor.setText(window.localStorage.getItem('initial-code') || '');
			this.editor.setTextChangeCallback(function(text) {
				window.localStorage.setItem('initial-code', text);
			});
			this.finish();
		},

		hideDares: function() {
			this.dares.hide();
		},

		getCanvas: function() {
			return this.canvas;
		},

		textChanged: function(code) {
			window.localStorage.setItem('program-3', code.text);
		}
	};
};