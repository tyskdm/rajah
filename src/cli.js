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
            {   name:           'specs',
                short:          's',
                type:           'csv,path',
                description:    'Spec files or directories to run.',
                example:        "'" + name + " --specs=file1,file2,..' or '" + name + " -s file1 -s file2..'"
            },
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
            {   name:           'report-type',
                short:          'r',
                type:           'string',
                description:    'Reporter type: console, junit.',
                example:        "'" + name + " --reporter-type=console' or '" + name + " -r junit'"
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
            },
            {   name:           'package',
                short:          'p',
                type:           'path',
                description:    'Output file',
                example:        "'" + name + " --outout=file' or '" + name + " -o file'"
            }
        ])
        .run();

    var fs = require('fs');
    var path = require('path');

    var cwd = process.cwd(),
        packageJson = null,
        projectdir = cwd,
        mainfile = argv.targets.length === 0 ? cwd : path.join(cwd, argv.targets[0]);
        // TODO: check if resolve is better way?

    if (fs.existsSync(mainfile)) {
        var stat = fs.statSync(mainfile);

        if (stat.isDirectory()) {
            if (fs.existsSync(path.join(mainfile, './package.json'))) {
                packageJson = path.join(mainfile, './package.json');
                projectdir = mainfile;
                mainfile = null;
            }

        } else if (stat.isFile() && (path.basename(mainfile) === 'package.json')) {
            packageJson = mainfile;
            projectdir = path.dirname(mainfile);
            mainfile = null;
        }
    }

    // all options should be fully resolved path.
    // and be possibly using platform path delimiter('\').
    var config = {
        rootdir:    projectdir,
        mainfile:   mainfile,

        source:     argv.options.source     || null,
        output:     argv.options.output     || null,
        core:       argv.options.core       || null,
        node_core:  argv.options.nodecore   || null,
        kernel:     argv.options.kernel     || null
    };

    // Create configure Application.
    var codegs = require('./codegs');
    var code = codegs.create();
    var error;

    if (packageJson) {
        error = code.loadPackageJson(packageJson);
        _check(error);
    }

    error = code.addConfig(config);
    _check(error);

    error = code.run();
    _check(error);

    process.exit(0);
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
