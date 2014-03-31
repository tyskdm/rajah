/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');
var fs = require('fs');
var timers = require('./timers');

function doGet(e) {

    var config, calledByHttp, fputs;

    if (typeof e !== 'undefined' && typeof e.queryString === 'string') {
        // execute by URL.
        config = e.parameter;
        calledByHttp = true;
    } else {
        // execute by debugger or time trigger.
        config = null;
        calledByHttp = false;
    }

    var print = function () {
        for (var i = 0, len = arguments.length; i < len; ++i) {
            process.stdout.write(String(arguments[i]));
        }
    };

    var rajahApp = require('./rajahApp.js').create();

    if (fs.existsSync('/rajah.json')) {
        if (fs.statSync('/rajah.json').isFile()) {
            rajahApp.addConfig(require('/rajah.json'));
        }
    }

    if (typeof rajahConfig === 'object') {
        rajahApp.addConfig(rajahConfig);
    }

    if (config) {
        rajahApp.addConfig(config);
    }

    if (calledByHttp) {
        rajahApp.addConfig({
            showColor:  false,
            reportType: 'onMemory'
        });
    }

    rajahApp.run();

    timers.execute();

    if (calledByHttp) {
        var output = ContentService.createTextOutput(rajahApp.getReport())
                     .setMimeType(ContentService.MimeType.TEXT);
        return output;
    }

    return undefined;
}