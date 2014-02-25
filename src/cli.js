
module.exports = function () {

    var rajah = require('./rajah');

    // options from command line
    var isVerbose = false;
    var showColors = true;
    var perfSuite = false;

    process.argv.forEach(function(arg) {
        switch (arg) {
        case '--color':
            showColors = true;
            break;
        case '--noColor':
            showColors = false;
            break;
        case '--verbose':
            isVerbose = true;
            break;
        case '--perf':
            perfSuite = true;
            break;
        }
    });

    specs = [];

    if (perfSuite) {
        specs = getFiles(__dirname + '/performance', new RegExp("test.js$"));
    } else {
        var consoleSpecs = getSpecFiles(__dirname + "/console"),
            coreSpecs = getSpecFiles(__dirname + "/core"),
            specs = consoleSpecs.concat(coreSpecs);
    }

    executeSpecs(specs, function(passed) {
        if (passed) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    }, isVerbose, showColors);
}

if (module.parent === null) {
    module.exports();
}
