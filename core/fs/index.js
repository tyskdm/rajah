
var moduleFiles = require('module')._files;
var mockfs = require('./mockfs');

var files = {};

for (var filename in moduleFiles) {
    files[filename] = {
        type:     'file',
        isModule: true,
        content:  moduleFiles[filename]
    }
}

module.exports = new mockfs(files);
