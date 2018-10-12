"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var zlib = require("zlib");
var HeadersTransformer_1 = require("./HeadersTransformer");
var ReverseProxy = /** @class */ (function () {
    function ReverseProxy() {
        this.config();
        this.startServer();
        //console.debug(this.httpListener.address());
    }
    ReverseProxy.prototype.config = function () {
        this.port = process.env.PORT || process.argv[2] || ReverseProxy.PORT;
        this.remoteUrl = process.env.REMOTE_HOST || process.argv[3] || ReverseProxy.HOST;
        console.group(this.remoteUrl);
        //console.log()
    };
    ReverseProxy.prototype.startServer = function () {
        this.httpListener = http.createServer();
        this.httpListener.listen(this.port).on("request", this.httpRequestHandler);
    };
    ReverseProxy.prototype.httpRequestHandler = function (cliReq, cliRes) {
        var _this = this;
        var remoteReqHeaders = HeadersTransformer_1.HeadersTransformer.fromIncomingToOutgoing(cliReq.headers, this.remoteUrl);
        //console.log(remoteReqHeaders)
        // const options =
        //console.log(JSON.stringify(options),[13],String.fromCharCode(13))
        var remoteUrl = this.remoteUrl;
        https.get({
            //headers: remoteReqHeaders,
            method: cliReq.method,
            path: cliReq.url,
            host: remoteUrl
        }, function (remoteRes) {
            var body = [];
            remoteRes.on("data", function (data) {
                console.debug("   + chunk, length: " + data.length);
                body = body.concat(data.slice());
            });
            remoteRes.on("error", function (err) {
                console.error(err);
            });
            remoteRes.on("end", function () {
                var remoteResHeaders = remoteRes.headers;
                var pureBody;
                if ((remoteResHeaders["content-encoding"] || "") === "gzip") {
                    pureBody = zlib.createGunzip().read();
                }
                else {
                    pureBody = body;
                }
                console.debug(
                //      "\x1b[34m\x1b[2m" + this.remoteUrl + remoteRes.req.path + "\x1b[0m: >>",
                );
                var resHeaders = {};
                Object.keys(remoteRes.headers)
                    .filter(function (e) { return HeadersTransformer_1.HeadersTransformer.reqiedHeaders.includes(e); })
                    .forEach(function (e) { return (resHeaders[e] = remoteRes.headers[e]); });
                if (/text0|script9/.test(remoteRes.headers["content-type"])) {
                    var strBody = pureBody.toString();
                    var preview = strBody.substr(0, 100) + " ... " + strBody.substr(-100, 100);
                    console.log(preview + " length: " + strBody.length);
                    // resHeaders["content-encoding"] = "utf8"
                    console.info("   client << " + JSON.stringify(resHeaders, null, 13));
                    cliRes.writeHead(200, resHeaders);
                    var fakeBody = strBody.replace(new RegExp(_this.remoteUrl, "igm"), "localhost");
                    if (fakeBody !== strBody) {
                        console.log(fakeBody);
                    }
                    cliRes.end(fakeBody);
                }
                else {
                    console.info("body.length: " + body.length);
                    resHeaders["content-type"] = remoteRes.headers["content-type"];
                    if (remoteRes.headers["content-encoding"]) {
                        resHeaders["content-encoding"] =
                            remoteRes.headers["content-encoding"];
                    }
                    console.info("   client << " + JSON.stringify(resHeaders, null, 13));
                    cliRes.writeHead(200, resHeaders);
                    cliRes.end(Buffer.from(body));
                }
            });
        });
    };
    ReverseProxy.PORT = 81;
    ReverseProxy.HOST = "browserleaks.com";
    return ReverseProxy;
}());
exports.ReverseProxy = ReverseProxy;
//# sourceMappingURL=ReverseProxy.js.map