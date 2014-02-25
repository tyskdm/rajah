
describe("HELLO Jasmine.", function () {
    it("Should be friend of rajah.", function () {
        var rajah = {
            isFriend: function (foo) { return true; }
        };
        expect(rajah.isFriend('Jasmine')).toBe(true);
    })
});
