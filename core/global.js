
if (typeof global === 'undefined') {

    (function () {
        this.global = this;
    })();

    global.process = require('process');

    if (typeof global.console === 'undefined') {
        global.console = require('console');
    }

    global.Buffer = require('buffer');

}

module.exports = global;
