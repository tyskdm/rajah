/*global rajahConfig: true
 */

/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');

var ContentService = require('ContentService');

function doGet(e) {

    var config, calledByHttp, consoleOut, error,
        timers = require('../lib/timers');

    if (typeof e !== 'undefined' && typeof e.queryString !== 'undefined') {
        // execute by Web Access.
        calledByHttp = true;
        consoleOut = false;
        config = {
            specs:          e.parameters.specs || null,
            match:          e.parameter.match || null,
            showColor:      (typeof e.parameter.color !== 'undefined') ||
                            (typeof e.parameter.noColor === 'undefined')
        };

    } else if (typeof e !== 'undefined') {
        // execute by some trigger.
        calledByHttp = false;
        consoleOut = false;
        config = null;

    } else {
        // execute by debugger.
        calledByHttp = false;
        consoleOut = true;
        config = null;
    }

    var rajahApp = require('../lib/rajahApp.js').create();

    if (typeof rajahConfig === 'object') {
        error = rajahApp.addConfig(rajahConfig);
        check_(error);
    }

    if (config) {
        error = rajahApp.addConfig(config);
        check_(error);
    }

    if ( ! consoleOut) {
        rajahApp.addConfig({
            showColor:  false,
            reportType: 'onMemConsole'
        });
    }

    if ((typeof rajahConfig === 'object') &&
        (typeof rajahConfig.onComplete === 'function')) {
        // add reporter to set callback 'onComplete'.
        rajahApp.rajah.addReporter({
            jasmineDone: rajahConfig.onComplete
        });
    }

    error = rajahApp.run();
    check_(error);

    timers.execute();

    if (calledByHttp) {
        var output = ContentService.createTextOutput(rajahApp.getReport())
                     .setMimeType(ContentService.MimeType.TEXT);
        return output;
    }

    return undefined;
}

function check_(error) {    // jshint ignore:line
                            // ~ used before it was defined.
    if (error !== null) {
        if (error.substr(0, 6) === 'Error:') {
            console.error(error);
            console.log('');
            process.exit(1);    // exit not exists. this code will throw.
        } else {
            console.log(error);
        }
    }
}
