/*
 *  doGet.js : rajah mainfile for GAS environment.
 */

require('global');
var fs = require('fs');
var timers = require('./timers');

function doGet(e) {

    var config, calledByHttp;

    if (typeof e.queryString === 'string') {
        // execute by URL.
        config = e.parameter;
        calledByHttp = true;

    } else {
        // execute by debugger or time trigger.
        config = null;
        calledByHttp = false;
    }


    var rajah = require('./rajahApp.js').create();

    if (fs.existsSync('/rajah.json')) {
        if (fs.statSync('/rajah.json').isFile()) {
            rajah.addConfig(require('/rajah.json'));
        }
    }

    if (typeof rajahConfig === 'object') {
        rajah.addConfig(rajahConfig);
    }

    if (config) {
        rajah.addConfig(config);
    }

    rajah.run();

    timers.execute();

    if (calledByHttp) {
        var output = ContentService.createTextOutput(JSON.stringify(jsonObject))
                     .setMimeType(ContentService.MimeType.XML);
        return output;
    }

    return undefined;
}
