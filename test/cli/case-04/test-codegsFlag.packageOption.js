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

var HERE = 'test/cli/';

exports.outputFlag = {

  setUp: function(done) {

    done();
  },

  '--codegs': function(test) {
    test.expect(2);

    var outfile1 = grunt.file.read(HERE + 'tmp/case-04-output1.js');
    var files1 = outfile1.match(/^require\('module'\).define\('\/test.+',$/mg);

    var outfile2 = grunt.file.read(HERE + 'tmp/case-04-output2.js');
    var files2 = outfile2.match(/^require\('module'\).define\('\/test.+',$/mg);

    test.deepEqual(files1, [
      "require('module').define('/test/cli/case-04/lib/target.js',",
      "require('module').define('/test/cli/case-04/spec/target-spec.js',"
    ], 'should not output to stdout.');

    test.deepEqual(files2, [
      "require('module').define('/test/cli/case-04/spec/target-spec.js',"
    ], 'should not output to stdout.');

    test.done();
  }
};
