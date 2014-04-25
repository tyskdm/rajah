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
        'test/cli/**/*.js',
        'test/doget/**/*.js',
        'test/jasmine/*.js'   // not check jsmine-core project files.
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      cli:   ['test/cli/case-*/test-*.js'],
      doget: ['test/doget/case-*/test-*.js']
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

      'run': {
        command: function (cmd) {
          return cmd;
        },
        options: {
          stdout: true,
          failOnError: true
        }
      },

      'rajah': {
        command: function () {
          var i, cmd = 'bin/rajah';
          for (i = 0; i < arguments.length; i++) {
            cmd += ' ' + arguments[i];
          }
          return cmd;
        },
        options: {
          stdout: true,
          failOnError: true
        }
      },

      'gas-upload': {
        command: function (target, filepath) {
          return 'gas upload' +
                 ' -f ' + this.config.get('gas')[target].fileId +
                 ' -S ' + this.config.get('gas')[target].filename + ':' + filepath +
                 ' -c ' + this.config.get('gas')[target].credential;
        },
        options: {
          stdout: true,
          failOnError: true
        }
      },

      'gas-wget': {
        command: function (target, filepath, options) {
          return 'wget' +
                 ' "' + this.config.get('gas')[target].dogetUrl + (options ? options : '') + '"' +
                 ' --load-cookies=' + this.config.get('gas')[target].dogetCookie +
                 ' -O ' + filepath;
        },
        options: {
          stdout: true,
          failOnError: true
        }
      }
    }
  });

  grunt.registerTask('check-result', 'check result returned from doget.', function(filepath) {

    var actual = grunt.file.read(filepath),
        output = actual,
        timestamp = grunt.config.get('timestamp');

    if (timestamp !== actual.match(/^.+(?=\n)/)[0]) {
      grunt.log.error('timestamp not match.');
      return false;
    }

    actual = actual.match(/^\d+ spec(s*), \d+ failure(s*)/mg);
    if (actual === null) {
      grunt.log.error('doget should return spec results.');
      return false;
    }

    actual = actual[0].split(',');
    actual = {
      specs:    parseInt(actual[0], 10),
      failures: parseInt(actual[1], 10)
    };
    if (actual.failures !== 0) {
      grunt.log.error('doget should not return failures. but ' + actual.failures + ' failures.');
      return false;
    }

    grunt.log.writeln('\n' + output);

    return true;
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');


  // rajah-core testing sub task.
  grunt.registerTask('rajahCore-test', ['shell:rajah:test/spec']);

  // cli testing sub task.
  grunt.registerTask('cli-test', [
    'shell:run:' + [
        './test/cli/case-01/test.sh',
        './test/cli/case-02/test.sh',
        './test/cli/case-03/test.sh'
    ].join('&&'),

    'shell:rajah:test/cli/case-04/spec' +
                ' --codegs -p test/cli/case-04/package1.json' +
                ' -o test/cli/tmp/case-04-output1.js',

    'shell:rajah:test/cli/case-04/spec' +
                ' --codegs -p test/cli/case-04/package2.json' +
                ' -o test/cli/tmp/case-04-output2.js',

    'nodeunit:cli'
  ]);

  // doget testing sub task.
  grunt.registerTask('doget-test', [
    'shell:rajah:test/doget/case-01/spec',

    'shell:rajah: --codegs -p test/doget/package.json' +
                ' --stamp="<%= timestamp %>"' +
                ' -o <%= testcode_doget %>',

    'shell:gas-upload:testbench:<%= testcode_doget %>',

    'shell:gas-wget:testbench:tmp/doget-case-01.txt:' +
                grunt.file.readJSON('test/doget/case-01/wget-option.json').options.join('&'),

    'check-result:tmp/doget-case-01.txt'
  ]);

  // jasmine testing sub task.
  grunt.registerTask('jasmine-test', [
    'shell:rajah:test/jasmine/jasmine-spec.js',

    'shell:rajah:test/jasmine/jasmine-spec.js' +
                ' --codegs -p test/jasmine/package.json' +
                ' --stamp="<%= timestamp %>"' +
                ' -o <%= testfile %>',

    'shell:gas-upload:jasminebench:<%= testfile %>',
    'shell:gas-wget:jasminebench:tmp/doget.txt',
    'check-result:tmp/doget.txt'
  ]);

  // common precheck sub task.
  grunt.registerTask('precheck', [
    'clean',
    'shell:mktmp',
    'shell:timestamp',
    'jshint',
    'rajahCore-test'
  ]);

  // main tasks.
  grunt.registerTask('cli',     ['precheck', 'cli-test']);

  grunt.registerTask('doget',   ['precheck', 'doget-test']);

  grunt.registerTask('jasmine', ['precheck', 'jasmine-test']);

  grunt.registerTask('rajah',   ['precheck', 'cli-test', 'doget-test']);

  grunt.registerTask('all',     ['precheck', 'cli-test', 'doget-test', 'jasmine-test']);

  grunt.registerTask('default', ['rajah']);
};
