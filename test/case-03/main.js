/*
 *  $ code test/jasmine/main.js -o out.js -s test
 */

if (typeof global === 'undefined') {
    require('global');
    require('./timer');
}


var rajah = require('../../src/rajah.js');
rajah.setup(global);
global.jasmine = rajah.jasmine;


require('./spec_main');


rajah.run();


if ( ! (process.versions && process.versions.node)) {
    require('./timer').execute();
}
