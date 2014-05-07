/*global rajahConfig: true
 */

/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');

var ContentService = require('ContentService');

function doGet(e) {

    try {
        var config, calledByHttp, consoleOut, error, onComplete,
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
        doGet._rajahApp = rajahApp;

        try {
            if (typeof rajahConfig === 'object') {
                if (typeof rajahConfig.onComplete === 'function') {
                    onComplete = rajahConfig.onComplete;
                } else {
                    onComplete = null;
                }

                error = rajahApp.addConfig(rajahConfig);
                check_(error);
            }

            if (config) {
                error = rajahApp.addConfig(config);
                check_(error);
            }

            if ( ! consoleOut) {
                error = rajahApp.addConfig({
                    showColor:  false,
                    reportType: 'onMemConsole'
                });
                check_(error);
            }

            try {
                error = rajahApp.run(onComplete);
            } catch(e) {
                check_('Exception: ' + e.message);
            }
            check_(error);

            try {
                timers.execute();
            } catch(e) {
                check_('Exception: ' + e.message);
            }

            if (calledByHttp) {
                return create_content_(rajahApp.getReport());
            }

        } catch(e) {
            if (calledByHttp) {
                return create_content_(e.message);
            } else {
                console.error(e);
            }
        }

    } catch(e) {
        // Can't handle this error, but try to show info as much as possible.
        var error_message = '';
        if ((typeof rajahConfig === 'object') && rajahConfig.stamp) {
            error_message += rajahConfig.stamp + '\n';
        } else {
            error_message += '[ STAMP NOT FOUND ]\n';
        }
        error_message += 'doGet Exception:\n' + e;
        console.log(error_message);

        return create_content_(error_message);
    }

    return undefined;
}

function create_content_(text) {    // jshint ignore:line
                                    // ~ used before it was defined.
    return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

function check_(error) {    // jshint ignore:line
                            // ~ used before it was defined.
    var message;

    if (error !== null) {
        if ((typeof rajahConfig === 'object') && rajahConfig.stamp) {
            message = rajahConfig.stamp + '\n';
        } else {
            message = '[ STAMP NOT FOUND ]\n';
        }

        message += 'Rajah Error:\n' +
                   error + '\n' +
                   '--- Rajah.reportContent ---\n' +
                   doGet._rajahApp.getReport() +
                   '\n---\n';

        throw new Error(message);
    }
}
