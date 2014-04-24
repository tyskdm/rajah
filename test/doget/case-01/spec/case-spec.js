
var DOGET = global.doGet || function () {};

if ((typeof process !== 'undefined') && process.versions && process.versions.node) {

    DOGET._rajahApp = {
        config: {
            "specs": [
              "test/doget/case-01/spec/case-spec.js"
            ],
            "match": [ "/\\.js$/" ],
            "reportType": "onMemConsole",
            "showColor": false
        }
    };
}

describe("doget: url-options:", function () {
    it("Should be handed to rajahApp.", function () {
        expect(DOGET._rajahApp.config.specs).toEqual([ 'test/doget/case-01/spec/case-spec.js' ]);
    });
    it("Should be handed to rajahApp.", function () {
        expect(DOGET._rajahApp.config.match).toEqual([ '/\\.js$/' ]);
    });
    it("Should be handed to rajahApp.", function () {
        expect(DOGET._rajahApp.config.reportType).toEqual('onMemConsole');
    });
    it("Should be handed to rajahApp.", function () {
        expect(DOGET._rajahApp.config.showColor).toBe(false);
    });
});
