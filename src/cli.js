
module.exports = function () {

    var path = require('path');
    var rajah = require('./rajah');

    // options from command line
    var isVerbose = false;
    var showColors = true;
    var specs = [];

    for (var i = process.argv.length - 1; i > 1; i--) {
        var arg = process.argv[i];
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
        default:
            specs.push(path.join(process.cwd(), arg));
        }
    }

    var opts = {
            showColors: showColors,
            isVerbose:  isVerbose,

            done: function (passed) {
                if (passed) {
                    process.exit(0);
                } else {
                    process.exit(1);
                }
            }
        };

    rajah.run(specs, opts);
}

if (module.parent === null) {
    module.exports();
}
