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

var HERE = 'test/cli/',
    expected = {};

exports.colorFlag = {

  setUp: function(done) {

    expected.color = grunt.file.read(HERE + 'case-01/out-color').split('\n').slice(0, 4);
    expected.nocolor = grunt.file.read(HERE + 'case-01/out-nocolor').split('\n').slice(0, 4);

    done();
  },

  'default': function(test) {
    test.expect(1);

    var actual = grunt.file.read(HERE + 'tmp/case-01-default').split('\n').slice(0, 4);
    test.deepEqual(actual, expected.color, 'outputs should be colored.');

    test.done();
  },

  '--color': function(test) {
    test.expect(1);

    var actual = grunt.file.read(HERE + 'tmp/case-01-color').split('\n').slice(0, 4);
    test.deepEqual(actual, expected.color, 'output should be colored.');

    test.done();
  },

  '--noColor': function(test) {
    test.expect(1);

    var actual = grunt.file.read(HERE + 'tmp/case-01-nocolor').split('\n').slice(0, 4);
    test.deepEqual(actual, expected.nocolor, 'output should not be colored.');

    test.done();
  }
};
