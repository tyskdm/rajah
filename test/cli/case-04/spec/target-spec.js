
describe("TARGET.js :", function () {
    var target = require('../lib/target.js');

    describe("Method sum :", function () {
        it("3 + 7 = 10", function () {
            expect(target.sum(3, 7)).toBe(10);
        });
    });

    describe("Method sub :", function () {
        it("10 - 7 = 3", function () {
            expect(target.sub(10, 7)).toBe(3);
        });
    });
});
