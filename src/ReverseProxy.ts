import * as http from "http";
import * as https from "https";
import * as zlib from "zlib";
import { HeadersTransformer } from './HeadersTransformer';

export class ReverseProxy {
    public static readonly PORT: number = 81
    public static readonly HOST: string = "browserleaks.com";
    private httpListener: http.Server
    private port: string | number
    private remoteUrl: string

    constructor() {
        this.config()
        this.startServer()
        //console.debug(this.httpListener.address());
    }

    private config(): void {
        this.port = process.env.PORT || process.argv[2] || ReverseProxy.PORT;
        this.remoteUrl = process.env.REMOTE_HOST || process.argv[3] || ReverseProxy.HOST;
       // console.group(this.remoteUrl)
    }

    private startServer(): void {
        this.httpListener = http.createServer();
        this.httpListener.listeners("get")
        this.httpListener.listen(this.port).on("request",(req,res) => this.httpRequestHandler(req, res));
    }
    private httpRequestHandler(cliReq : http.IncomingMessage, cliRes:http.ServerResponse)  :void {
        const remoteReqHeaders = HeadersTransformer.fromIncomingToOutgoing(cliReq.headers, this.remoteUrl)
        //console.log(remoteReqHeaders)
        // const options =

        //console.log(JSON.stringify(options),[13],String.fromCharCode(13))

        const options:object = {
            //headers: remoteReqHeaders,
            "method": cliReq.method,
            "path": cliReq.url,
            "host" : this.remoteUrl,
            "headers": remoteReqHeaders
        }


        https.get({
            //headers: remoteReqHeaders,
            method: cliReq.method,
            path: cliReq.url,
            host}
            , (remoteRes: http.IncomingMessage) =>  {
            let body: Number[] = [];

            remoteRes.on("data", (data) => {
                console.debug("   + chunk, length: " + data.length);
                body = body.concat([...data]);
            });

            remoteRes.on("error", (err) => {
                console.error(err);
            });

        remoteRes.on("end", () => {
            const remoteResHeaders = remoteRes.headers;
            let pureBody: string | Buffer | Number[];

            if ((remoteResHeaders["content-encoding"] || "") === "gzip") {
                pureBody = zlib.createGunzip().read()
            } else {
                pureBody = body;
            }

            console.debug(
          //      "\x1b[34m\x1b[2m" + this.remoteUrl + remoteRes.req.path + "\x1b[0m: >>",
            );
            const resHeaders = {};
            Object.keys(remoteRes.headers)
                .filter((e) => HeadersTransformer.reqiedHeaders.includes(e))
                .forEach((e) => (resHeaders[e] = remoteRes.headers[e]));

            if (/text0|script9/.test(remoteRes.headers["content-type"])) {
                const strBody = pureBody.toString();
                const preview =
                    strBody.substr(0, 100) + " ... " + strBody.substr(-100, 100);
                console.log(preview + " length: " + strBody.length);
                // resHeaders["content-encoding"] = "utf8"

                console.info("   client << " + JSON.stringify(resHeaders, null, 13));
                cliRes.writeHead(200, resHeaders);
                const fakeBody = strBody.replace(
                    new RegExp(this.remoteUrl, "igm"),
                    "localhost",
                );
                if (fakeBody !== strBody) {
                    console.log(fakeBody);
                }
                cliRes.end(fakeBody);
            } else {
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

        })
    })

    }

}
