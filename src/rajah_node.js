
var fs = require('fs');
var jasmine = initJasmine(global);

exports.jasmine = jasmine;
exports.run = run;

if (typeof global.doGet === 'function') {
    exports._doGet = global.doGet;

    global.doGet = function (e) {
        var results = doGet(e);
        if (results === null) {
            results = exports._doGet(e);
        }
        return results;
    }
}



function initJasmine(global) {
    // boot code for jasmine
    var jasmineJS = require('jasmine-core/lib/jasmine-core/jasmine.js');
    var jasmine = jasmineJS.core(jasmineJS);

    _extend(jasmineJS, require('jasmine-core/lib/console/console.js'));
    jasmineJS.console(jasmineJS, jasmine);

    var env = jasmine.getEnv();

    _extend(global, {
        describe: function(description, specDefinitions) {
           return env.describe(description, specDefinitions);
        },

        xdescribe: function(description, specDefinitions) {
            return env.xdescribe(description, specDefinitions);
        },

        it: function(desc, func) {
            return env.it(desc, func);
        },

        xit: function(desc, func) {
            return env.xit(desc, func);
        },

        beforeEach: function(beforeEachFunction) {
            return env.beforeEach(beforeEachFunction);
        },

        afterEach: function(afterEachFunction) {
            return env.afterEach(afterEachFunction);
        },

        expect: function(actual) {
            return env.expect(actual);
        },

        spyOn: function(obj, methodName) {
            return env.spyOn(obj, methodName);
        },

        jsApiReporter: new jasmine.JsApiReporter({
            timer: new jasmine.Timer()
        })
    });

    _extend(jasmine, {
        addCustomEqualityTester: function(tester) {
            env.addCustomEqualityTester(tester);
        },

        addMatchers: function(matchers) {
            return env.addMatchers(matchers);
        },

        clock: function() {
            return env.clock;
        }
    });

    return jasmine;
}

function _extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
}


// Jasmine "runner"
function run(specs, opts) {

    var specFiles = [];
    for (var i = 0; i < specs.length; i++) {
        specFiles = specFiles.concat(getFiles(specs[i], /.js$/))
    }

    var results;
    executeSpecs(specFiles, function(passed) {
        results = passed;
    }, opts.isVerbose, opts.showColors);
    return results;
}

function executeSpecs(specs, done, isVerbose, showColors) {

    for (var i = 0; i < specs.length; i++) {
        var filename = specs[i];
        require(filename.replace(/\.\w+$/, ""));
    }

    var env = jasmine.getEnv();
    var consoleReporter = new jasmine.ConsoleReporter({
        print: function() {
            for (var i = 0, len = arguments.length; i < len; ++i) {
                process.stdout.write(String(arguments[i]));
            }
        },
        onComplete: done,
        showColors: showColors,
        timer: new jasmine.Timer()
    });

    env.addReporter(consoleReporter);
    env.execute();
}

function getFiles(dir, matcher) {
    var allFiles = [];

    if (fs.statSync(dir).isFile() && dir.match(matcher)) {
        allFiles.push(dir);
    } else {
        var files = fs.readdirSync(dir);
        for (var i = 0, len = files.length; i < len; ++i) {
            var filename = dir + '/' + files[i];
            if (fs.statSync(filename).isFile() && filename.match(matcher)) {
                allFiles.push(filename);
            } else if (fs.statSync(filename).isDirectory()) {
                var subfiles = getFiles(filename, matcher);
                subfiles.forEach(function(result) {
                    allFiles.push(result);
                });
            }
        }
    }
    return allFiles;
}



function doGet(e) {
    if (typeof e !== 'undefined' && e.rajah === undefined) {
        return null;
    }
    var results;



    return results;
}

