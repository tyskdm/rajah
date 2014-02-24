
var process = {};

process.platform = 'GoogleAppsScript';
process.pid = 0;
process.title = 'code';

process.argv = [ 'code' ];
process.execPath = '/code';
process.execArgv = [];
process.env = {};
process.env.NODE_DEBUG = false;

process.version = '';
process.versions = {};

process.noDeprecation = false;
process.throwDeprecation = true;

process.cwd = function () {
    return '/';
};

var logger = require('Logger');

process.stdout = { write: function (data) {
        logger.log(data);
    }
};

Error.captureStackTrace = function (THIS, stackStartFunction) {
    logger.log( 'Error.captureStackTrace:\n' +
                '>> tshi = ' + THIS + '\n' +
                '>> Function = ' + stackStartFunction );
};

module.exports = process;
