
var rajah = rajah || require('../../../../lib/rajah.js');

describe("rajah:", function () {
    it("should has jasmine.", function () {
        expect(typeof rajah.jasmine).toBe('object');
    });
});
