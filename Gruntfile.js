'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    gas: grunt.file.readJSON('gas.json'),

    testfile: 'tmp/testcode.gs',

    jshint: {
      files: [
        'Gruntfile.js',
        'bin/**/*.js',
        'lib/**/*.js',
        'src/**/*.js',
        'test/spec/**/*.js',
        'test/jasmine/jasmine-spec.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    shell: {
      'mktmp': {
        command: 'mkdir tmp'
      },
      'rajah-spec': {
        command: 'bin/rajah test/spec',
        options: {
          stdout: true
        }
      },
      'jasmine-spec': {
        command: 'bin/rajah test/jasmine/jasmine-spec.js',
        options: {
          stdout: true
        }
      },
      'jasmine-codegs': {
        command: 'bin/rajah test/jasmine/jasmine-spec.js --codegs -p test/jasmine/package.json -o <%= testfile %>',
        options: {
          stdout: true
        }
      },
      'test-case-01': {
        command: 'test/case-01/rajah.sh'
      },
      'test-case-02': {
        command: 'test/case-02/rajah.sh'
      },
      'gas-upload-testbench': {
        command: 'gas upload -f <%= gas.testbench.fileId %> -S "<%= gas.testbench.filename%>:<%= testfile %>" -c <%= gas.testbench.credential %>'
      },
      'gas-upload-jasminebench': {
        command: 'gas upload -f <%= gas.jasminebench.fileId %> -S "<%= gas.jasminebench.filename%>:<%= testfile %>" -c <%= gas.jasminebench.credential %>'
      }
    },

    clean: {
      tests: ['tmp']
    },

    nodeunit: {
      tests: ['test/case-*/test-*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');

  // rajah testing sub tasks.
  grunt.registerTask('rajah-spec', ['shell:rajah-spec']);
  grunt.registerTask('rajah-test', [
    'clean',
    'shell:mktmp',
    'shell:test-case-01',
    'shell:test-case-02',
    'nodeunit'
  ]);

  // jasmine testing sub tasks.
  grunt.registerTask('jasmine-spec', ['shell:jasmine-spec']);
  grunt.registerTask('jasmine-test', [
    'clean',
    'shell:mktmp',
    'shell:jasmine-codegs',
    'shell:gas-upload-jasminebench'
  ]);


  // main tasks.
  grunt.registerTask('jasmine', ['jasmine-spec', 'jasmine-test']);
  grunt.registerTask('rajah', ['jshint', 'rajah-spec', 'rajah-test']);
  grunt.registerTask('default', ['rajah']);
};
