
var rajah = require('../../src/rajah.js');

rajah.setup(global);

describe("TEST", function () {
    it("should pass.", function () {
        expect(true).toBe(true);
    });
});


rajah.run(function () {
    console.log('END!');
});
