/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');
this.timers = require('./timers');

this.rajah = require('./rajah.js');
var jasmine = this.rajah.jasmine;

function init(THIS) {
    this.GLOBAL = THIS;
    return this.rajah.setup(THIS);
}

function addReporter(reporter) {
    return this.rajah.addReporter(reporter);
}

function addConsoleReporter(showColors, print) {
    return this.rajah.addConsoleReporter(showColors, print);
}

function run(onComplete) {
    this.rajah.run(onComplete);
    this.timers.execute();
}

