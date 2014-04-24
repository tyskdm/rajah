'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var expected = {};

exports.urlOptions = {

  setUp: function(done) {

    done();
  },

  'failures': function(test) {
    test.expect(4);

    /*
      359 specs, 0 failures, 1 pending spec
      Finished in 2.124 seconds
    */
    var actual = grunt.file.read('tmp/doget-case-01.txt');
    var timestamp = grunt.file.read('tmp/timestamp');

    test.equal(timestamp, actual.match(/^.+\n/)[0], "timestamp not match.");

    var results = actual.match(/^\d+ spec(s*), \d+ failure(s*)/mg);
    test.notEqual(results, null, 'doget should return spec results.');

    results = results[0].split(',');
    results = {
      specs:    parseInt(results[0], 10),
      failures: parseInt(results[1], 10)
    };

    // grunt.log.writeln('' + actual.specs + ' specs, ' + actual.failures + ' failures.');
    test.ok(results.specs > 0,
        'doget should return spec results. but ' + results.specs + ' specs.');

    test.equal(results.failures, 0,
        'doget should not return failures. but ' + results.failures + ' failures.');

    //console.log('\ndoGet result - Stamp: ' + timestamp.slice(0, -1));
    //console.log('doGet result - ' + results.specs + ' specs, ' + results.failures + ' failures.');
    console.log('\n' + actual);

    test.done();
  }

};
