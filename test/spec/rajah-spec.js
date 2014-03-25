


describe("rajah", function () {
    it("Should be friend of jasmine.", function () {
        var rajah = {
            isFriend: function (foo) { return true; }
        };
        expect(rajah.isFriend('Jasmine')).toBe(true);
    });
});

