/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');

function doGet(e) {

    var config, calledByHttp, error,
        timers = require('./timers');

    if (typeof e !== 'undefined' && typeof e.queryString !== 'undefined') {
        // execute by Web Access.
        calledByHttp = true;
        config = e.parameters;
        if (config.reportType) {
            this.config.reportType = config.reportType[0];
        }

    } else {
        // execute by debugger or time trigger.
        calledByHttp = false;
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

    if (calledByHttp) {
        rajahApp.addConfig({
            showColor:  false,
            reportType: 'onMemory'
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
