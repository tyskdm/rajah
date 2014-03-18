

/*
 *  $ code test/jasmine/main.js -o out.js -s test
 */

if (typeof global === 'undefined') {
    require('global');
}

require('./jasmine/spec/node_suite');
