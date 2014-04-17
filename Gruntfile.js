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
      'test-case-01': {
        command: 'test/case-01/rajah.sh'
      },
      'gas-upload': {
        command: 'gas upload -f <%= gas.fileId %> -S "Code:<%= testfile %>" -c <%= gas.credential %>'
      }
    },

    clean: {
      tests: ['tmp']
    },

    nodeunit: {
      tests: ['test/case-*/*_test.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('rajah-spec', ['shell:rajah-spec']);
  grunt.registerTask('rajah-test', ['shell:mktmp', 'shell:test-case-01']);
  grunt.registerTask('gas-upload', ['shell:gas-upload']);

  grunt.registerTask('test', ['clean', 'rajah-test', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'rajah-spec', 'test']);
};
