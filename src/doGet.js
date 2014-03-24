/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

function doGet(e) {

    var config;

    if (typeof e === 'undefined') {
        // execute by debugger.

        config = rajaConfig || {};


    } else  if (typeof e.query === 'object') {
        // execute by URL.

        config = e.query;


    } else if (typeof e.some === 'object') {
        // execute by time trigger.

        config = {};
    }

    require('global');
    require('./timer');

    var rajahApp = require('./rajahApp.js').create();

    rajahApp.run();

    require('./timer').execute();


    return resultString;
}
