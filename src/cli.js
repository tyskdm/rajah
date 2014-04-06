module.exports = function () {

    var packageinfo = require('../package.json'),
        name = packageinfo.name,
        version = packageinfo.version || '--.--.--';

    var argv = require('argv')
        .version(version)
        .info("Usage: " + name + " SPECFILES [Options]\n\n" +
              "SPECFILES:  Spec files or directories.\n\n" +
              "Options:")
        .option([
            {   name:           'color',
                type:           'string'
            },
            {   name:           'noColor',
                type:           'string'
            },
            {   name:           'match',
                short:          'm',
                type:           'string',
                description:    'matcher RegExp. always added i(ignore case) option.',
                example:        "'" + name + " --match=-Spec\\.js$' or '" + name + " -s -Spec\\.js$'"
            },
            //{   name:           'reportType',
            //    short:          'r',
            //    type:           'string',
            //    description:    'reporter type. [ console | junit ]',
            //},
            {   name:           'output',
                short:          'o',
                type:           'path',
                description:    'Output filepath result will be stored in.',
                example:        "'" + name + " --outout=FILEPATH' or '" + name + " -o FILEPATH'"
            },
            {   name:           'codegs',
                type:           'string',
                description:    'execute Codegs and output to specified file.',
            },
            {   name:           'package',
                short:          'p',
                type:           'path',
                description:    'filepath which package file should be handed to codegs command.',
                example:        "'" + name + " --path=FILEPATH' or '" + name + " -p FILEPATH'"
            }
        ])
        .run();

    // all options should be fully resolved path.
    var config = {
        specs:          argv.targets,
        showColor:      (typeof argc.options.color !== 'undefined') ||
                        (typeof argc.options.noColor === 'undefined'),
        match:          argv.options.match      || null,
        output:         argv.options.output     || null,
        codegs:         typeof argv.options.codegs !== 'undefined',
        packagefile:    argv.options['package'] || null
    };

    // Create and configure Application.
    var rajahApp = require('./rajahApp').create();
    var error;

    error = rajahApp.addConfig(config);
    _check(error);

    error = rajahApp.run();
    _check(error);
};

function _check(error) {
    if (error !== null) {
        if (error.substr(0, 6) === 'Error:') {
            console.error(error);
            console.log('');
            process.exit(1);
        } else {
            console.log(error);
        }
    }
}


if (module.parent === null) {
    module.exports();
}
