'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
      'rajah_spec': {
        command: 'bin/rajah test/spec',
        options: {
          stdout: true
        }
      },
      'rajah_case-01': {
        command: 'test/case-01/rajah.sh'
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


  grunt.registerTask('rajah_spec', ['shell:rajah_spec']);
  grunt.registerTask('rajah_test', ['shell:mktmp', 'shell:rajah_case-01']);

  grunt.registerTask('test', ['clean', 'rajah_test', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'rajah_spec', 'test']);
};
