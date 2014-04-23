'use strict';

module.exports = function (onComplete) {

    var onCompleteFunc = onComplete || function() {},
        specCount,
        failureCount,
        pendingCount;

    this.jasmineStarted = function() {
        specCount = 0;
        failureCount = 0;
        pendingCount = 0;
    };

    this.jasmineDone = function() {
        onCompleteFunc((failureCount === 0), specCount, failureCount, pendingCount);
    };

    this.specDone = function(result) {
        specCount++;

        switch (result.status) {
        case 'pending':
            pendingCount++;
            break;

        case 'failed':
            failureCount++;
            break;

        default:  // 'passed'
            // nop;
        }

        //if (result.status === "pending") {
        //    pendingCount++;
        //} else if (result.status === "failed") {
        //    failureCount++;
        //}
        // if (result.status === "passed") return;
    };
};
