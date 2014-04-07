/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');

function doGet(e) {

    var config, calledByHttp, consoleOut, error,
        timers = require('./timers');

    if (typeof e !== 'undefined' && typeof e.queryString !== 'undefined') {
        // execute by Web Access.
        calledByHttp = true;
        consoleOut = false;
        config = {
            specs:          e.parameters || null,
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

    var rajahApp = require('./rajahApp.js').create();

    if (typeof rajahConfig === 'object') {
        error = rajahApp.addConfig(rajahConfig);
        _check(error);
    }

    if (config) {
        error = rajahApp.addConfig(config);
        _check(error);
    }

    if ( ! consoleOut) {
        rajahApp.addConfig({
            showColor:  false,
            reportType: 'onMemory'
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
    _check(error);

    timers.execute();

    if (calledByHttp) {
        var output = ContentService.createTextOutput(rajahApp.getReport())
                     .setMimeType(ContentService.MimeType.TEXT);
        return output;
    }

    return undefined;
}

function _check(error) {
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
