/**
 *  tst/case-01 : test rajah.js if it execute jasmine.
 *  test:
 *  $ node main.js
 */

var rajah = require('../../lib/rajah.js');

rajah.setup(global);

describe("TEST", function () {
    it("should pass.", function () {
        expect(true).toBe(true);
    });
});


rajah.run(function () {
    console.log('END!');
});
