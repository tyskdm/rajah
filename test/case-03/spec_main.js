var fs = require('fs');
var path = require('path');


setupTarget();
loadSpecs();


// Setup target

function setupTarget() {

  var j$require = require(path.join(__dirname + "/../jasmine/jasmine/src/core/requireCore.js"));
  extend(j$require, require(path.join(__dirname + "/../jasmine/jasmine/src/console/requireConsole.js")));

  var srcFiles = getFiles(path.join(__dirname + "/../jasmine/jasmine/src/core"), /./);
  srcFiles.push(path.join(__dirname + "/../jasmine/jasmine/src/version.js"));
  srcFiles.push(path.join(__dirname + "/../jasmine/jasmine/src/console/ConsoleReporter.js"));

  global.getJasmineRequireObj = function () { return j$require; };

  for (var i = 0; i < srcFiles.length; i++) {
    require(srcFiles[i]);
  }

  delete global.getJasmineRequireObj;

  global.j$ = j$require.core(j$require);
  j$require.console(j$require, global.j$);
}

function extend(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
}


// Load Spec files

function loadSpecs(perfSuite) {

  specs = [];

  if (perfSuite) {
    specs = getFiles(path.join(__dirname + '/../jasmine/jasmine/spec/performance'), new RegExp("test.js$"));
  } else {
    var consoleSpecs = getSpecFiles(path.join(__dirname + "/../jasmine/jasmine/spec/console")),
        coreSpecs = getSpecFiles(path.join(__dirname + "/../jasmine/jasmine/spec/core")),
        specs = consoleSpecs.concat(coreSpecs);
  }

  for (var i = 0; i < specs.length; i++) {
    var filename = specs[i];
    require(filename.replace(/\.\w+$/, ""));
  }
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
