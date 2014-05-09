
// this spec file is for only gas environment.

var RAJAH = global.rajah;

describe("rajah:", function () {
    var passed, spec, failure, pending;

    it("should run spec files:", function () {
        var J = {};
        RAJAH.setup(J);

        J.describe("case[pass]:", function () {
            J.it("should pass.", function() {
                J.expect(true).toBe(true);
            });
            J.it("should pass.", function() {
                J.expect(true).toBe(false);
            });
            J.xit("should pass.", function() {
                J.expect(true).toBe(false);
            });
        });

        RAJAH.run(function (p, s, f, d) {
            passed = p;
            spec = s;
            failure = f;
            pending = d;
        });

        expect(passed).toBe(false);
        expect(spec).toBe(3);
        expect(failure).toBe(1);
        expect(pending).toBe(1);
    });
});
