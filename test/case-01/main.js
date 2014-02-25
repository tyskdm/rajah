
// Setup Node.js emulator if global not exists.
if (typeof global === 'undefined') {
    require('global');
}

var path = require('path');

var specfile = path.join(__dirname, 'spec.js');
require('../../src/rajah').run([specfile], {});
