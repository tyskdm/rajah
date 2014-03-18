var fs = require('fs');
var util = require('util');
var path = require('path');

// boot code for jasmine
var jasmineRequire = require('../jasmine/lib/jasmine-core/jasmine.js');
var jasmine = jasmineRequire.core(jasmineRequire);

var consoleFns = require('../jasmine/lib/console/console.js');
extend(jasmineRequire, consoleFns);
jasmineRequire.console(jasmineRequire, jasmine);

var env = jasmine.getEnv();

var jasmineInterface = {
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
};

extend(global, jasmineInterface);

function extend(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
}

jasmine.addCustomEqualityTester = function(tester) {
  env.addCustomEqualityTester(tester);
};

jasmine.addMatchers = function(matchers) {
  return env.addMatchers(matchers);
};

jasmine.clock = function() {
  return env.clock;
};

// Jasmine "runner"
function executeSpecs(specs, done, isVerbose, showColors) {
  global.jasmine = jasmine;

  for (var i = 0; i < specs.length; i++) {
    var filename = specs[i];
    require(filename.replace(/\.\w+$/, ""));
  }

  var env = jasmine.getEnv();
  var consoleReporter = new jasmine.ConsoleReporter({
    print: util.print,
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

function getSpecFiles(dir) {
  return getFiles(dir, new RegExp("Spec.js$"));
}

var j$require = (function() {
  var exported = {},
      j$req;

  global.getJasmineRequireObj = getJasmineRequireObj;

  j$req = require(path.join(__dirname + "/../jasmine/src/core/requireCore.js"));
  extend(j$req, require(path.join(__dirname + "/../jasmine/src/console/requireConsole.js")));

  var srcFiles = getFiles(path.join(__dirname + "/../jasmine/src/core"), /./);
  srcFiles.push(path.join(__dirname + "/../jasmine/src/version.js"));
  srcFiles.push(path.join(__dirname + "/../jasmine/src/console/ConsoleReporter.js"));

  for (var i = 0; i < srcFiles.length; i++) {
    require(srcFiles[i]);
  }
  extend(j$req, exported);

  delete global.getJasmineRequireObj;

  return j$req;

  function getJasmineRequireObj() {
    return exported;
  }
}());

j$ = j$require.core(j$require);
j$require.console(j$require, j$);

// options from command line
var isVerbose = false;
var showColors = true;
var perfSuite = false;

process.argv.forEach(function(arg) {
  switch (arg) {
    case '--color':
      showColors = true;
      break;
    case '--noColor':
      showColors = false;
      break;
    case '--verbose':
      isVerbose = true;
      break;
    case '--perf':
      perfSuite = true;
      break;
  }
});

specs = [];

if (perfSuite) {
  specs = getFiles(path.join(__dirname + '/../jasmine/spec/performance'), new RegExp("test.js$"));
} else {
  var consoleSpecs = getSpecFiles(path.join(__dirname + "/../jasmine/spec/console")),
      coreSpecs = getSpecFiles(path.join(__dirname + "/../jasmine/spec/core")),
      specs = consoleSpecs.concat(coreSpecs);
}

executeSpecs(specs, function(passed) {
  if (passed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, isVerbose, showColors);
