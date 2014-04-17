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

exports.matchFlag = {

  setUp: function(done) {

    done();
  },

  'noOption': function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/case-02-noOption').match(/^case-spec.+js$/mg);
    test.deepEqual(
        actual,
        ['case-spec-01.js', 'case-spec-02.js', 'case-spec.js'],
        'should run all files.'
    );

    test.done();
  },

  '-m spec\\.js': function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/case-02-noNum').match(/^case-spec.+js$/mg);
    test.deepEqual(
        actual,
        ['case-spec.js'],
        'should run all files.'
    );

    test.done();
  },

  '-m spec-.+\\.js': function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/case-02-num').match(/^case-spec.+js$/mg);
    test.deepEqual(
        actual,
        ['case-spec-01.js', 'case-spec-02.js'],
        'should run all files.'
    );

    test.done();
  }
};
