/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');
this.timers = require('../lib/timers');

this.rajah = require('../lib/rajah.js');
var jasmine = this.rajah.jasmine;

/**
 * Initialize rajah and get Jasmine-API.
 * @param {object} THIS global scope object.
 */
function init(THIS) {
    this.GLOBAL = THIS;
    return this.rajah.setup(THIS);
}

/**
 * Wrapper function for jasmine.addReporter.
 * @param {object} reporter
 */
function addReporter(reporter) {
    return this.rajah.addReporter(reporter);
}

/**
 * Setup original Console-reporter with original print function.
 * @param {boolean} showColors
 * @param {function} print function print(str) should puts string without trailing '\n'.
 */
function addConsoleReporter(showColors, print) {
    return this.rajah.addConsoleReporter(showColors, print);
}

/**
 * Execute Jasmine.
 * @param {function} onComplete function onComplete(passed).
 */
function run(onComplete) {
    this.rajah.run(onComplete);
    this.timers.execute();
}
