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

exports.outputFlag = {

  setUp: function(done) {

    done();
  },

  'nooption': function(test) {
    test.expect(1);

    var stdout = grunt.file.read('tmp/case-03-nooption-stdout');
    test.equal(stdout.indexOf('Started'), 0, 'should output to stdout.');

    test.done();
  },

  '-o': function(test) {
    test.expect(2);

    var outfile = grunt.file.read('tmp/case-03-o-outfile');
    var stdout = grunt.file.read('tmp/case-03-o-stdout');

    test.equal(stdout.indexOf('Started'), -1, 'should not output to stdout.');
    test.equal(outfile.indexOf('Started'), 0, 'should stored to outfile.');

    test.done();
  },

  '--output': function(test) {
    test.expect(2);

    var outfile = grunt.file.read('tmp/case-03-output-outfile');
    var stdout = grunt.file.read('tmp/case-03-output-stdout');

    test.equal(stdout.indexOf('Started'), -1, 'should not output to stdout.');
    test.equal(outfile.indexOf('Started'), 0, 'should stored to outfile.');

    test.done();
  }
};
