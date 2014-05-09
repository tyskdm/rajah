
var RAJAH = null;

beforeEach(function () {
    RAJAH = require('../../lib/rajah').create();
});

describe("rajah", function () {

    it("Should has own jasmine object.", function () {
        var RAJAH2 = RAJAH.create();
        expect(RAJAH.jasmine).not.toBe(RAJAH2.jasmine);
    });

    describe("should run spec files and return results:", function () {

        var J = {};
        var passed, spec, failure, pending, report;

        beforeEach(function (done) {
            RAJAH.setup(J);
            report = '';

            J.describe("run specs:", function () {
                J.it("should be 'pass'.", function() {
                    J.expect(true).toBe(true);
                });
                J.it("should be 'failure'.", function() {
                    J.expect(true).toBe(false);
                });
                J.xit("should be 'pending'.", function() {
                    J.expect(true).toBe(false);
                });
            });

            RAJAH.addConsoleReporter(true, function (str) { report += str; });

            RAJAH.run(function (p, s, f, d) {
                passed = p;
                spec = s;
                failure = f;
                pending = d;

                done();
            });
        });

        it("should print message.", function () {
            expect(report.indexOf('Started') === 0).toBe(true);
        });

        it("should return resultset.", function () {
            expect(passed).toBe(false);
            expect(spec).toBe(3);
            expect(failure).toBe(1);
            expect(pending).toBe(1);
        });
    });
});
