
// Setup Node.js emulator if global not exists.
if (typeof global === 'undefined') {
    require('global');
}

// Setup jasmine with default settings.
// If doGet function exists, rajah hooks it.
require('rajah').init(global);
function doGet(e) {}


// any user code.
