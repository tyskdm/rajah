

/*
 *  $ code test/jasmine/main.js -o out.js -s test
 */

if (typeof global === 'undefined') {
    require('global');
}

require('./spec/node_suite');
