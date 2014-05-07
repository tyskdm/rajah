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
      cli:      ['test/cli/case-*/test-*.js']
    },

    clean: {
      tmp: [ 'tmp',
             'test/cli/tmp',
             'test/doget/tmp'
           ]
    },

    codegs: {
      gaslib: {
        options: {
          mainfile:     'src/main.js',
          core:         'node_modules/codegs-core/code/gas',
          node_core:    'node_modules/codegs-core/node/v0.10.26',
          node_modules: [ 'jasmine-core' ]
        },
        files: {
          'tmp/gaslib-dev-out.js': [
            'node_modules/jasmine-core',
            'src/main.js',
            'lib/rajah.js',
            'lib/rajahApp.js',
            'lib/timers.js'
          ]
        }
      }
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

  grunt.registerTask('check-result', 'check result returned from doget.', function(filepath, expected, opt) {

    var resultText;

    try {
      resultText = grunt.file.read(filepath);
    } catch(e) {
      grunt.log.error("FILE-READ-ERROR: " + filepath + "\n" + e);
      return false;
    }

    var actual = resultText.split('\n', 3),
        timestamp = grunt.config.get('timestamp'),
        resultStatus = null,
        stampConfirmed = false;

    /*
     *  Check First line.
     */
    if (actual[0] === '<!DOCTYPE html>') {
      var title = resultText.match(/<\s*title\s*>(.+?)<\s*\/\s*title\s*>/i)[1];

      if (title.indexOf('Meet Google Drive') === 0) {
        resultStatus = 'ACCESS-ERROR';

      } else if (title === 'Error') {
        resultStatus = 'GAS-ERROR';

      } else {
        resultStatus = 'UNKNOWN-HTML-ERROR';
      }

    } else if (actual[0] === '[ STAMP NOT FOUND ]') {
      stampConfirmed = false;

    } else if (actual[0] === timestamp) {
      stampConfirmed = true;

    } else {
      resultStatus = 'STAMP-NOT-MATCH';
    }

    if (resultStatus !== null) {
      grunt.log.error(resultStatus + ':');
      return false;
    }


    /*
     *  Check 2nd. line.
     */
    if (actual[1] === 'doGet Exception:') {
      resultStatus = 'DOGET-EXCEPTION';

    } else if (actual[1] === 'Rajah Error:') {
      if (actual[2].indexOf('Error:') === 0) {
        if (expected !== 'error') {
          resultStatus = 'RAJAH-ERROR';
        } else {
          return true;
        }

      } else if (actual[2].indexOf('Exception:') === 0) {
        if (expected !== 'exception') {
          resultStatus = 'RAJAH-EXCEPTION';
        } else {
          return true;
        }

      } else {
        resultStatus = 'RAJAH-UNKNOWN-ERROR';
      }

    } else if (actual[1] !== 'Started') {
      resultStatus = 'DOGET-UNKNOWN-ERROR';
    }

    if (resultStatus !== null) {
      grunt.log.error(resultStatus + (stampConfirmed ? ': STAMP=OK' : ': STAMP=NOT-FOUND'));
      return false;
    }

    /*
     *  Check Jasmine-Report.
     */
    actual = resultText.match(/^\d+ spec(s*), \d+ failure(s*)/mg);
    if (actual === null) {
      grunt.log.error('JASMINE-INVALID-RESULT:');
      return false;
    }

    actual = actual[0].split(',');
    actual = {
      specs:    parseInt(actual[0], 10),
      failures: parseInt(actual[1], 10)
    };
    if (actual.failures !== 0) {
      if (expected === 'failure') {
        if (typeof opt !== 'undefined') {
          opt = parseInt(opt, 10);
          if (actual.failures !== opt) {
            grunt.log.error('JASMINE-ERROR: expected ' + opt + ' failures but ' + actual.failures + ' failures.');
            return false;
          }
        }
        return true;    // expect result to return failures.
      }
      grunt.log.error('JASMINE-FAILURE: expected pass but ' + actual.failures + ' failures.');
      return false;
    }

    if (expected === 'specs') {
      if (typeof opt !== 'undefined') {
        opt = parseInt(opt, 10);
        if (actual.specs !== opt) {
          grunt.log.error('JASMINE-ERROR: expected ' + opt + ' specs. but ' + actual.specs + ' specs.');
          return false;
        } else {
          return true;
        }
      } else {
        grunt.log.error('CHECKER-ERROR: number of specs expected is required.');
        return false;
      }
    }

    if (expected !== 'pass') {
      grunt.log.error('CHECKER-UNKNOWN-ERROR: result is expected ' + expected + '. but pass.');
      return false;
    }
    grunt.log.writeln('\n' );

    return true;
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-codegs');

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

    // case-01
    'shell:gas-wget:testbench:tmp/doget-case-01.txt:' +
                grunt.file.readJSON('test/doget/case-01/wget-option.json').options.join('&'),
    'check-result:tmp/doget-case-01.txt:pass',

    // case-02
    'shell:gas-wget:testbench:tmp/doget-case-02-pass.txt:' +
                grunt.file.readJSON('test/doget/case-02/wget-option-pass.json').options.join('&'),
    'check-result:tmp/doget-case-02-pass.txt:pass',

    'shell:gas-wget:testbench:tmp/doget-case-02-fail.txt:' +
                grunt.file.readJSON('test/doget/case-02/wget-option-fail.json').options.join('&'),
    'check-result:tmp/doget-case-02-fail.txt:failure:1',

    // case-03
    'shell:gas-wget:testbench:tmp/doget-case-03-rajahError.txt:' +
                grunt.file.readJSON('test/doget/case-03/wget-option-rajahError.json').options.join('&'),
    'check-result:tmp/doget-case-03-rajahError.txt:error',

    'shell:gas-wget:testbench:tmp/doget-case-03-exceptionError.txt:' +
                grunt.file.readJSON('test/doget/case-03/wget-option-exceptionError.json').options.join('&'),
    'check-result:tmp/doget-case-03-exceptionError.txt:exception'
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
    'check-result:tmp/doget.txt:pass'
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
