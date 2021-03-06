'use strict';

var jasmineJS = require('jasmine-core/lib/jasmine-core/jasmine.js');
_extend(jasmineJS, require('jasmine-core/lib/console/console.js'));

var DumbReporter = require('./dumbreporter');

function Rajah () {

    this.jasmine = jasmineJS.core(jasmineJS);   // create new jasmine instance.
    this.hasReporter = false;
    jasmineJS.console(jasmineJS, this.jasmine);

    var env = this.jasmine.getEnv();

    _extend(this.jasmine, {
        addCustomEqualityTester: function(tester) {
            env.addCustomEqualityTester(tester);
        },

        addMatchers: function(matchers) {
            return env.addMatchers(matchers);
        },

        clock: function() {
            return env.clock;
        }
    });

    this.jasmineInterface = {
        describe: function(description, specDefinitions) {
           return env.describe(description, specDefinitions);
        },

        xdescribe: function(description, specDefinitions) {
            return env.xdescribe(description, specDefinitions);
        },

        it: function(desc, func) {
            return env.it(desc, func);
        },

        xit: function(desc, func) {
            return env.xit(desc, func);
        },

        beforeEach: function(beforeEachFunction) {
            return env.beforeEach(beforeEachFunction);
        },

        afterEach: function(afterEachFunction) {
            return env.afterEach(afterEachFunction);
        },

        expect: function(actual) {
            return env.expect(actual);
        },

        pending: function() {
          return env.pending();
        },

        spyOn: function(obj, methodName) {
            return env.spyOn(obj, methodName);
        },

        jsApiReporter: new this.jasmine.JsApiReporter({
            timer: new this.jasmine.Timer()
        })
    };
}

Rajah.prototype = {

    create: function () {
        return new Rajah();
    },

    setup: function (scopeObj) {
        _extend(scopeObj, this.jasmineInterface);
        // scopeObj.jasmine = this.jasmine;
    },

    addReporter: function (reporter) {
        this.jasmine.getEnv().addReporter(reporter);
        this.hasReporter = true;
    },

    addConsoleReporter: function (showColors, print) {

        print = print || function() {
            for (var i = 0, len = arguments.length; i < len; ++i) {
                process.stdout.write(String(arguments[i]));
            }
        };

        var config = {
            print:      print,
            showColors: showColors,
            timer:      new this.jasmine.Timer()
        };

        var consoleReporter = new this.jasmine.ConsoleReporter(config);

        this.jasmine.getEnv().addReporter(consoleReporter);
        this.hasReporter = true;
    },

    run: function (onComplete) {

        if ( ! this.hasReporter) {
            this.addConsoleReporter(true);      // set 'showColors' true
        }

        if (typeof onComplete === 'function') {
            // add reporter to set callback 'onComplete'.
            this.addReporter(new DumbReporter(onComplete));
        }

        this.jasmine.getEnv().execute();
    }
};

function _extend(destination, source) {     // jshint ignore:line
                                            // ~ used before it was defined.
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
}


module.exports = new Rajah();
