
var RAJAH = typeof global.rajah !== 'undefined' ? global.rajah : require('../../../../lib/rajah.js');

describe("rajah:", function () {
    describe("has methods and properties:", function () {
        it("property jasmine.", function () {
            expect(typeof RAJAH.jasmine).toBe('object');
        });
        it("methods.", function () {
            expect(typeof RAJAH.setup).toBe('function');
            expect(typeof RAJAH.addReporter).toBe('function');
            expect(typeof RAJAH.addConsoleReporter).toBe('function');
            expect(typeof RAJAH.run).toBe('function');
        });
    });

    it("should setup jasmine-interface into scope object:", function () {
        var SCOPE = {};
        RAJAH.setup(SCOPE);

        expect(typeof SCOPE.describe).toBe('function');
        expect(typeof SCOPE.xdescribe).toBe('function');
        expect(typeof SCOPE.it).toBe('function');
        expect(typeof SCOPE.xit).toBe('function');
        expect(typeof SCOPE.beforeEach).toBe('function');
        expect(typeof SCOPE.afterEach).toBe('function');
        expect(typeof SCOPE.expect).toBe('function');
        expect(typeof SCOPE.pending).toBe('function');
        expect(typeof SCOPE.spyOn).toBe('function');
        expect(typeof SCOPE.jsApiReporter).toBe('object');
    });
});
