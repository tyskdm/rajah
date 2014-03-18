

/*
 *  $ code test/jasmine/main.js -o out.js -s test
 */

if (typeof global === 'undefined') {
    require('global');
    require('./timer');
}


require('./jasmine_node_suite/node_suite');




if ( ! (process.versions && process.versions.node)) {
    require('./timer').execute();
}

