module.exports = function () {

    var packageinfo = require('../package.json'),
        name = packageinfo.name,
        version = packageinfo.version || '--.--.--';

    var argv = require('argv')
        .version(version)
        .info("Usage: " + name + " SPECFILES [Options]\n\n" +
              "SPECFILES:  spec files or directories.\n\n" +
              "Options:")
        .option([
            {   name:           'match',
                short:          'm',
                type:           'string',
                description:    'mather RegEx.',
                example:        "'" + name + " --reporter-type=console' or '" + name + " -r junit'"
            },
            {   name:           'helpers',
                type:           'csv,path',
                description:    'Spec files or directories to run.',
                example:        "'" + name + " --specs=file1,file2,..'"
            },
            {   name:           'output',
                short:          'o',
                type:           'path',
                description:    'Output file',
                example:        "'" + name + " --outout=file' or '" + name + " -o file'"
            },
            {   name:           'codegs',
                type:           'path',
                description:    'execute Codegs and output to specified file.',
                example:        "'" + name + " --outout=file' or '" + name + " -o file'"
            }
        ])
        .run();

    // all options should be fully resolved path.
    var config = {
        specs:      argv.targets,
        match:      argv.options.match      || null,
        helpers:    argv.options.helpers    || null,
        output:     argv.options.output     || null,
        codegs:     argv.options.codegs     || null
    };

    // Create configure Application.
    var rajahApp = require('./rajahApp');
    var rajah = rajahApp.create();
    var error;

    var fs = require('fs'),
        path = require('path');

    var packagefile = path.join(process.cwd(), './package.json');
    var packageConfig;
    if (fs.existsSync(packagefile)) {
        if (fs.statSync(packagefile).isFile()) {
            packageConfig = require(packagefile)._rajah;
            if (packageConfig) {
                error = rajah.addConfig(packagefile);
                _check(error);
            }
        }
    }

    error = rajah.addConfig(config);
    _check(error);

    error = rajah.run();
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
