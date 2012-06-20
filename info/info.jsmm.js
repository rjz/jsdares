/*jshint node:true jquery:true*/
"use strict";

var robot = require('../robot');

module.exports = function(info) {
	info.tables.push({
		html: '<p><span class="info-table-output"><i class="icon-wrench icon-white"></i> javascript</span></p><p>Below you find the basic constructs of the <strong>JavaScript</strong> language. Programs are executed from <strong>top to bottom</strong>, one statement after another. Use the <strong>Step</strong> button to see in detail how your program is executed.</p>',
		list: [
			{
				name: 'number',
				id: 'number',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>Numbers can be used by just writing the <strong>number</strong> in the code, like <var>0</var> or <var>-3</var>. For very <strong>large</strong> or <strong>small</strong> numbers you can use the scientific notation: <var>2.99e8</var>.</p>');

					info.consoleExample(infoTable, $content, 'console.log(10);\nconsole.log(-10);\nconsole.log(2.99e8);\nconsole.log(1.0e-3);');
				}
			},
			{
				name: 'string',
				id: 'string',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>To represent <strong>text</strong> we use the <strong>string</strong> notation, for example <var>"Hi!"</var>. Everything in between <strong>apostrophes</strong> is a string, so also <var>"3"</var> is a string and not a number. When printing a string to the console it is always displayed exactly as entered.</p>');

					info.consoleExample(infoTable, $content, 'console.log("Hello!");\nconsole.log("2.99e8");');
				}
			},
			{
				name: 'boolean',
				id: 'boolean',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>A <strong>boolean</strong> is something that is either <strong>true</strong> or <strong>false</strong>, and we write this simply by writing <var>true</var> or <var>false</var>. They are used, for example, in comparisons and logic operators.</p>');

					info.consoleExample(infoTable, $content, 'console.log(true);\nconsole.log(false);\nconsole.log(10 > 0);');
				}
			},
			{
				name: 'var <small>(declaration)</small>',
				id: 'var',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>The <var>var</var> keyword is used for <strong>declaring</strong> a variable. You specify a <strong>name</strong>, which can then be used for <strong>storing</strong> information. For example, after writing <var>var text;</var>, you can use the variable <var>text</var>, for example by assigning a string to it: <var>text = "Hey!";</var>. You can also immediately <strong>assign</strong> a value to a variable when declaring it, for example <var>var age = 17;</var>. After declaring a variable you can use it in other statements, such as calculations.</p>');

					info.robotExample(infoTable, $content, 'var distance = 2;\nrobot.drive(distance);');

					info.consoleExample(infoTable, $content, 'var number = 5;\nconsole.log(number);\nconsole.log(number+2);\nconsole.log(number*number);\n\nvar text = "Hey!"\nconsole.log(text);');
				}
			},
			{
				name: '= <small>(assignment)</small>',
				id: '=',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>The <var>=</var> operator is used for <strong>assigning</strong> a value to a variable, which first has to be declared using <var>var</var>. On the left side you put the <strong>name</strong> of the variable, and on the right side the <strong>value</strong> you want to assign to it, for example <var>height = 100;</var>. You can use the variable name itself on the right side as well. An example <var>counter = counter + 1;</var>, which increases the value of <var>counter</var> by one.</p>');

					info.consoleExample(infoTable, $content, 'var counter = 1;\nconsole.log(counter);\ncounter = counter+1;\nconsole.log(counter);\ncounter = counter*3;\nconsole.log(counter);\n\nvar height = 100;\nconsole.log(height);\nheight = height * counter;\nconsole.log(height);');
				}
			},
			{
				name: '+, -, *, /, % <small>(numbers only)</small>',
				id: '+',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These are the basic <strong>math</strong> operators: <var>+</var> is addition, <var>-</var> is subtraction, <var>*</var> is multiplication, and <var>/</var> is division. The last one is <var>%</var>, remainder, which is a bit more uncommon. For more information about these operators, you can search online.</p>');

					info.consoleExample(infoTable, $content, 'console.log(4+6);\nconsole.log(10-3);\nconsole.log(5*10);\nconsole.log(81/9);\nconsole.log(18%5);');

					info.robotExample(infoTable, $content, 'robot.drive(5-2);');
				}
			},
			{
				name: '+, += <small>(strings only)</small>',
				id: '+s',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p><var>+</var> is not only used for addition, but also for <strong>concatenating</strong> strings with strings, or strings with numbers. For example <var>"Hello " + "World!"</var> results in <var>"Hello World!"</var>. The shorthand <var>+=</var> also works.</p>');

					info.consoleExample(infoTable, $content, 'console.log("Hello " + "World!");\n\nvar text = "Age: ";\ntext += 42;\nconsole.log(text);');
				}
			},
			{
				name: '+=, -=, *=, /=, %= <small>(numbers only)</small>',
				id: '+=',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These operators are basically <strong>shorthands</strong>. <var>a += b;</var> is shorthand for <var>a = a + b;</var>, <var>a -= b;</var> is shorthand for <var>a = a - b;</var>, and so on.</p>');

					info.consoleExample(infoTable, $content, 'var counter = 1;\nconsole.log(counter);\ncounter += 1;\nconsole.log(counter);\ncounter *= 3;\nconsole.log(counter);\n\nvar height = 100;\nconsole.log(height);\nheight *= counter;\nconsole.log(height);');

					info.canvasExample(infoTable, $content, 'var x = 10;\ncontext.fillRect(x, 70, 10, 10);\nx += 30;\ncontext.fillRect(x, 70, 10, 10);\nx += 30;\ncontext.fillRect(x, 70, 10, 10);');
				}
			},
			{
				name: '++, -- <small>(numbers only)</small>',
				id: '++',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These two are even shorter <strong>shorthands</strong>. <var>a++;</var> is the same as writing <var>a = a + 1;</var>, or increasing the variable <var>a</var> by one. <var>a--;</var> means decreasing the variable by one, or <var>a = a - 1;</var>.</p>');

					info.consoleExample(infoTable, $content, 'var counter = 1;\nconsole.log(counter);\ncounter++;\nconsole.log(counter);\ncounter++;\nconsole.log(counter);\ncounter--;\nconsole.log(counter);\ncounter--;\nconsole.log(counter);');
				}
			},
			{
				name: '! <small>(booleans only)</small>',
				id: '!',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>To <strong>invert</strong> a boolean, you can use <var>!</var>. For example, <var>!true</var> is just <var>false</var>.</p>');

					info.consoleExample(infoTable, $content, 'console.log(!true);\nconsole.log(!(5 == 7));');
				}
			},
			{
				name: '==, !=',
				id: '==',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These two operators <strong>compare</strong> values. <var>==</var> checks if two values are the <strong>same</strong>, and returns <var>true</var> if they are, and <var>false</var> if they are not. <var>!=</var> is the opposite, it checks if values are <strong>not</strong> the same.</p>');

					info.consoleExample(infoTable, $content, 'console.log(5 == 5);\nconsole.log(5 == "Hi");\nconsole.log(5 != 5);\nconsole.log(5 != "Hi");');
				}
			},
			{
				name: '>, >=, <, <= <small>(numbers only)</small>',
				id: '>',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These operators <strong>compare</strong> numbers. <var>a &gt; b</var> returns <var>true</var> if <var>a</var> is <strong>greater than</strong> <var>b</var>, and <var>a &gt;= b</var> returns <var>true</var> if <var>a</var> is <strong>greater than or equal</strong> to <var>b</var>. The other two work the other way around.</p>');

					info.consoleExample(infoTable, $content, 'console.log(10 > 5);\nconsole.log(5 >= 5);\nconsole.log(3 < 5);\nconsole.log(5 < 3);');
				}
			},
			{
				name: '&&, || <small>(booleans only)</small>',
				id: '&&',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>These operators are used to <strong>combine</strong> boolean values (<var>true</var> and <var>false</var>). <var>a && b</var> returns <var>true</var> if <strong>both</strong> <var>a</var> and <var>b</var> are <var>true</var>, so it is also called <em>and</em>. <var>a || b</var> returns <var>true</var> is <strong>either</strong> of them is <var>true</var>, so it is also called <em>or</em>.</p>');

					info.consoleExample(infoTable, $content, 'console.log(true && true);\nconsole.log(true && false);\nconsole.log(true || false);\nconsole.log(false || !(10 == 11));\nconsole.log(false || false);');
				}
			},
			{
				name: 'if (boolean)',
				id: 'if',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>The if-statement is used to <strong>control</strong> what parts of the program are run. Only when the boolean is <var>true</var>, is the part between brackets executed.</p>');

					info.consoleExample(infoTable, $content, 'if (false) {\n  console.log("Hello!");\n}\n\nif (true) {\n  console.log("Goodbye!");\n}\n');

					info.robotExample(infoTable, $content, 'while(!robot.detectGoal()) {\n  if (robot.detectWall()) {\n    robot.turnLeft();\n  }\n  robot.drive();\n}', '{"columns":3,"rows":4,"initialX":1,"initialY":3,"initialAngle":90,"mazeObjects":1,"verticalActive":[[false,false,false,false],[false,false,false,false],[false,true,false,false]],"horizontalActive":[[false,true,false,false],[false,true,false,false],[false,false,false,false]],"blockGoal":[[false,true,false,false],[false,false,false,false],[false,false,false,false]],"numGoals":1}');
				}
			},
			{ // am-pm does not work!
				name: 'else',
				id: 'else',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p><var>else</var> is always used <strong>together</strong> with <var>if</var>. The part between the brackets after the else-statement is only executed if the boolean in the if-statement is <var>false</var>. Both statements can also be <strong>combined</strong> into an <var>else if</var>, see the example below.</p>');

					info.consoleExample(infoTable, $content, 'var number = 6;\nif (number == 10) {\n  console.log("Number is 10");\n} else {\n  console.log("Number is not 10");\n}\n\nvar weight = 25;\nvar maximum = 18;\nif (weight <= maximum) {\n  console.log("Bag is allowed");\n} else {\n  console.log("Bag is too heavy");\n}\n\nvar time = 15;\nif (time < 12) {\n  console.log("morning");\n} else if (time < 18) {\n  console.log("afternoon");\n} else {\n  console.log("evening");\n}');
				}
			},
			{
				name: 'while (boolean)',
				id: 'while',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>The while-loop is used to create <strong>repetition</strong> in a program. Before the part between the brackets is executed, the boolean is <strong>checked</strong>. If it is <var>true</var>, the part is <strong>executed</strong>, otherwise the part is <strong>skipped</strong>, like with an if-statement. After executing the code between brackets, the boolean is checked <strong>again</strong>, and so on.</p>');

					info.consoleExample(infoTable, $content, 'var i = 0;\nwhile(i < 5) {\n  console.log(i);\n  i = i+1;\n}');
				}
			},
			{
				name: 'for (statement; boolean; statement)',
				id: 'for',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>The for-loop is a <strong>shorthand</strong> notation for commonly used while-loops. The first statement is executed <strong>before</strong> the for-loop starts, which is often used for <strong>initializing</strong> a variable, such as <var>i = 0</var>. The boolean is <strong>checked</strong> before the part between brackets is executed, just as with while-loops. Finally, the second statement is <strong>executed</strong> after each loop, for example to increase a counter variable by doing <var>i++</var>.</p>');

					info.consoleExample(infoTable, $content, 'for(var i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n\n');

					info.canvasExample(infoTable, $content, 'for (var i=0; i<10; i++) {\n  var x = 10+i*10;\n  context.fillRect(x, 10+i*15, 5, 5);\n  context.fillRect(x, 145-i*15, 5, 5);\n}');
				}
			},
			{
				name: 'function name(arguments)',
				id: 'function',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>Functions are used to avoid having to write the <strong>same code</strong> over and over again. They are pieces of code that you can <strong>call</strong> from other points in the program. Between parentheses you can specify <strong>variables</strong> that should be passed into the function, these are called <em>arguments</em>. Most of the commands in this list are functions, for example <var>console.log</var> is a function that takes one string variable as argument.</p>');

					info.robotExample(infoTable, $content, 'function forwardRight(distance) {\n  robot.drive(distance);\n  robot.turnRight();\n}\nforwardRight(3);\nforwardRight(2);\nforwardRight(2);\nforwardRight(1);');

					info.consoleExample(infoTable, $content, 'function printAmPm(hour) {\n  if (hour == 0) {\n    console.log(\"12am\");\n  } else if (hour < 12) {\n    console.log(hour + \"am\");\n  } else if (hour == 12) {\n    console.log(\"12pm\");\n  } else {\n    console.log((hour-12) + \"pm\");\n  }\n}\n\nprintAmPm(15);\nprintAmPm(0);\nprintAmPm(5);\nprintAmPm(12);');

					info.canvasExample(infoTable, $content, '\nfunction smiley(x, y) {\n  context.fillRect(x+7, y+6, 5, 5);\n  context.fillRect(x+18, y+6, 5, 5);\n  context.beginPath();\n  context.arc(x+15, y+9, 12, 0.5, -3.6);\n  context.fill();\n}\nsmiley(10, 10);\nsmiley(20, 80);\nsmiley(40, 120);\nsmiley(80, 60);\ncontext.fillStyle = "#0aa";\nsmiley(120, 30);');
				}
			},
			{
				name: 'return value',
				id: 'return',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>Functions can also <strong>return</strong> some value after they have been run. For example, <var>robot.detectWall()</var> returns <var>true</var> or <var>false</var> depending on whether or not the robot faces a wall. Your functions can return some value, too. For example, to return the number 5 at some point in a function, you write <var>return 5;</var>. The function then stops and returns that number at the place where it was called.</p>');

					info.consoleExample(infoTable, $content, 'function largest(num1, num2) {\n  if (num1 > num2) {\n    return num1;\n  } else {\n    return num2;\n  }\n}\n\nconsole.log(largest(6, 10));\nconsole.log(largest(30, 40) + 2);\nconsole.log(largest(0, 5) + largest(5, 10));');
				}
			},
			{
				name: '[value1, value2, ...] <small>(array creation)</small>',
				id: 'array',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>An <strong>array</strong> is a list of variables, all of which have a <strong>number</strong>. This allows you to store a bunch of <strong>values</strong> at once, instead of having to declare a lot of variables. A <strong>new</strong> array is written like this: <var>[]</var>. You can also put some values in when creating an array. For example, if we create an array with letters, <var>["a", "b", "c"]</var>, then these letters are placed on positions 0, 1, and 2.</p>');

					info.consoleExample(infoTable, $content, 'var letters = ["a", "b", "c"];\nconsole.log(letters[0]);\nconsole.log(letters[1]);\nconsole.log(letters[2]);');
				}
			},
			{
				name: 'array[] <small>(array access)</small>',
				id: '[]',
				outputs: [],
				makeContent: function(infoTable, $content) {
					$content.html('<p>In order to <strong>retrieve</strong> values from an array, and to <strong>put</strong> new values in an array, we write <var>array[0]</var>, or with any other number. You then get the <strong>value</strong> corresponding to that number, just when writing a variable name. The difference with a normal variable, however, is that we can also <strong>calculate</strong> this number, for example <var>letters[10-8]</var>.</p>');

					info.consoleExample(infoTable, $content, 'var letters = ["a", "b", "c"];\nconsole.log(letters[0]);\nconsole.log(letters[10-8]);\n\nletters[10] = "k";\nconsole.log(letters[10]);');
				}
			}
		]
	});
};
