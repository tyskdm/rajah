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
        '<%= nodeunit.cli %>',
        '<%= nodeunit.jasmine %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tmp: [ 'tmp',
             'test/cli/tmp' ]
    },

    shell: {
      'mktmp': {
        command: [
          'mkdir tmp',
          'mkdir test/cli/tmp'
        ].join('&&')
      },

      // rajah-core related tasks.
      'rajah-spec': {
        command: 'bin/rajah test/spec',
        options: {
          stdout: true
        }
      },

      // Jamine-core related tasks.
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
      'jasmine-wget': {
        command: 'wget --load-cookies=<%= gas.jasminebench.dogetCookie %> <%= gas.jasminebench.dogetUrl %> -O tmp/doget.txt',
        options: {
          stdout: true
        }
      },

      // cli related tasks.
      'cli-test': {
        options: { execOptions: { cwd: 'test/cli' } },
        command: [
            './case-01/rajah.sh',
            './case-02/rajah.sh',
            './case-03/rajah.sh'
        ].join('&&')
      },

      //  gas uploader tasks.
      'gas-upload-testbench': {
        command: 'gas upload -f <%= gas.testbench.fileId %> -S "<%= gas.testbench.filename%>:<%= testfile %>" -c <%= gas.testbench.credential %>'
      },
      'gas-upload-jasminebench': {
        command: 'gas upload -f <%= gas.jasminebench.fileId %> -S "<%= gas.jasminebench.filename%>:<%= testfile %>" -c <%= gas.jasminebench.credential %>'
      }
    },

    nodeunit: {
      jasmine: ['test/jasmine/test-*.js'],
      cli: ['test/cli/case-*/test-*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');


  // cli testing sub tasks.
  grunt.registerTask('cli-test', [
    'shell:mktmp',
    'shell:cli-test',
    'nodeunit:cli'
  ]);

  // rajah testing sub tasks.
  grunt.registerTask('rajah-spec', ['shell:rajah-spec']);

  // jasmine testing sub tasks.
  grunt.registerTask('jasmine-spec', ['shell:jasmine-spec']);
  grunt.registerTask('jasmine-test', [
    'shell:mktmp',
    'shell:jasmine-codegs',
    'shell:gas-upload-jasminebench',
    'shell:jasmine-wget',
    'nodeunit:jasmine'
  ]);


  // main tasks.
  grunt.registerTask('cli',     ['clean', 'jshint', 'rajah-spec', 'cli-test']);

  grunt.registerTask('jasmine', ['clean', 'jshint', 'rajah-spec', 'jasmine-spec', 'jasmine-test']);

  grunt.registerTask('rajah',   ['clean', 'jshint', 'rajah-spec']);

  grunt.registerTask('default', ['rajah']);
};
