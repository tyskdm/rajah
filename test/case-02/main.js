
var rajah = require('../../src/rajah.js');

rajah.setup(global);

require('./spec.js');


rajah.run(function () {
    console.log('END!');
});
