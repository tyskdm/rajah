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
    test.expect(1);

    /*
      359 specs, 0 failures, 1 pending spec
      Finished in 2.124 seconds
    */
    var actual = grunt.file.read('tmp/doget.txt').match(/^\d+ spec(s*), \d+ failure(s*)/mg);

    actual = actual[0].split(',');

    actual = {
      specs:    parseInt(actual[0], 10),
      failures: parseInt(actual[1], 10)
    };

    test.deepEqual(
        actual,
        { specs: 359, failures: 0 },
        'doget returns error-result.'
    );

    test.done();
  }

};
