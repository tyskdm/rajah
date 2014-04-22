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

exports.doget = {

  setUp: function(done) {

    done();
  },

  'failures': function(test) {
    test.expect(3);

    /*
      359 specs, 0 failures, 1 pending spec
      Finished in 2.124 seconds
    */
    var actual = grunt.file.read('tmp/doget.txt');
    var timestamp = grunt.file.read('tmp/timestamp');

    test.equal(timestamp, actual.match(/^.+\n/)[0], "timestamp not match.");

    actual = actual.match(/^\d+ spec(s*), \d+ failure(s*)/mg);
    test.notEqual(actual, null, 'doget should return spec results.');

    actual = actual[0].split(',');
    actual = {
      specs:    parseInt(actual[0], 10),
      failures: parseInt(actual[1], 10)
    };

    // grunt.log.writeln('' + actual.specs + ' specs, ' + actual.failures + ' failures.');
    test.equal(actual.failures, 0,
        'doget should not return failures. but ' + actual.failures + ' failures.');

    test.done();
  }

};
