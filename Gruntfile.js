'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    gas: grunt.file.readJSON('gas.json'),

    timestamp: new Date().toString(),
    testfile: 'tmp/testcode.gs',
    testcode_doget: 'tmp/testcode-doget.gs',

    jshint: {
      files: [
        'Gruntfile.js',
        'bin/**/*.js',
        'lib/**/*.js',
        'src/**/*.js',
        'test/spec/**/*.js',
        'test/doget/**/*.js',
        'test/jasmine/jasmine-spec.js',
        '<%= nodeunit.cli %>',
        '<%= nodeunit.jasmine %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      cli: ['test/cli/case-*/test-*.js'],
      doget: ['test/doget/case-*/test-*.js'],
      jasmine: ['test/jasmine/test-*.js']
    },

    clean: {
      tmp: [ 'tmp',
             'test/cli/tmp',
             'test/doget/tmp'
           ]
    },

    shell: {
      'mktmp': {
        command: [
          'mkdir tmp',
          'mkdir test/cli/tmp',
          'mkdir test/doget/tmp'
        ].join('&&')
      },

      'timestamp': {
        command: 'echo "<%= timestamp %>" > tmp/timestamp',
        options: {
          failOnError: true
        }
      },

      // rajah-core related tasks.
      'rajah-spec': {
        command: 'bin/rajah test/spec',
        options: {
          failOnError: true,
          stdout: true
        }
      },

      // cli related tasks.
      'cli-test': {
        options: { stdout: true, stderr: true, execOptions: { cwd: 'test/cli' } },
        command: [
            './case-01/rajah.sh',
            './case-02/rajah.sh',
            './case-03/rajah.sh'
        ].join('&&')
      },
      'cli-codegs': {
        options: { stdout: true, stderr: true },
        command: [
          'bin/rajah test/cli/case-04/spec --codegs -p test/cli/case-04/package1.json -o test/cli/tmp/case-04-output1.js',
          'bin/rajah test/cli/case-04/spec --codegs -p test/cli/case-04/package2.json -o test/cli/tmp/case-04-output2.js'
        ].join('&&')
      },


      // doGet related tasks.
      'doget-codegs': {
        command: 'bin/rajah --codegs -p test/doget/package.json --stamp="<%= timestamp %>" -o <%= testcode_doget %>',
        options: {
          stdout: true
        }
      },
      'doget-wget-case-01': {
        command: [
          'wget --load-cookies=<%= gas.testbench.dogetCookie %>' +
          ' "<%= gas.testbench.dogetUrl %>' +
          grunt.file.readJSON('test/doget/case-01/wget-option.json').options.join('&') + '"' +
          ' -O tmp/doget-case-01.txt'
        ].join('&&'),
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
        command: 'bin/rajah test/jasmine/jasmine-spec.js --codegs -p test/jasmine/package.json --stamp="<%= timestamp %>" -o <%= testfile %>',
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

      //  gas uploader tasks.
      'gas-upload-testbench': {
        command: 'gas upload -f <%= gas.testbench.fileId %> -S "<%= gas.testbench.filename%>:<%= testcode_doget %>" -c <%= gas.testbench.credential %>',
        options: {
          failOnError: true
        }
      },
      'gas-upload-jasminebench': {
        command: 'gas upload -f <%= gas.jasminebench.fileId %> -S "<%= gas.jasminebench.filename%>:<%= testfile %>" -c <%= gas.jasminebench.credential %>',
        options: {
          failOnError: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');


  // rajah testing sub tasks.
  grunt.registerTask('rajah-spec', ['shell:rajah-spec']);

  // cli testing sub tasks.
  grunt.registerTask('cli-test', [
    'shell:cli-test',
    'shell:cli-codegs',
    'nodeunit:cli'
  ]);

  // doget testing sub tasks.
  grunt.registerTask('doget-test', [
    'shell:doget-codegs',
    'shell:gas-upload-testbench',
    'shell:doget-wget-case-01',
    'nodeunit:doget'
  ]);

  // jasmine testing sub tasks.
  grunt.registerTask('jasmine-spec', ['shell:jasmine-spec']);
  grunt.registerTask('jasmine-test', [
    'shell:jasmine-codegs',
    'shell:gas-upload-jasminebench',
    'shell:jasmine-wget',
    'nodeunit:jasmine'
  ]);


  grunt.registerTask('precheck', [
    'clean',
    'shell:mktmp',
    'shell:timestamp',
    'jshint',
    'rajah-spec'
  ]);

  // main tasks.
  grunt.registerTask('cli',     ['precheck', 'cli-test']);

  grunt.registerTask('doget',   ['precheck', 'doget-test']);

  grunt.registerTask('jasmine', ['precheck', 'jasmine-spec', 'jasmine-test']);

  grunt.registerTask('rajah',   ['precheck', 'cli-test', 'doget-test']);

  grunt.registerTask('default', ['rajah']);
};
