"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HeadersTransformer = /** @class */ (function () {
    function HeadersTransformer() {
    }
    HeadersTransformer.fromIncomingToOutgoing = function (clientHeaders, fakeHost) {
        var fakeHeaders = clientHeaders;
        fakeHeaders.host = fakeHost;
        fakeHeaders.Host = fakeHost;
        return fakeHeaders;
    };
    HeadersTransformer.reqiedHeaders = [
        "connection",
        "host",
        "path",
        "content-type",
        "transfer-encoding",
        "user-agent",
        "content-encoding",
        "content-type",
    ];
    return HeadersTransformer;
}());
exports.HeadersTransformer = HeadersTransformer;
//# sourceMappingURL=HeadersTransformer.js.map