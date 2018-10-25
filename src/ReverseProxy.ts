import * as http from "http"
import * as https from "https"
import * as zlib from "zlib"
import { HeadersTransformer } from './HeadersTransformer'
import { OutgoingHttpHeaders, IncomingHttpHeaders  } from 'http'
import { IncomingMessage } from './IncomingMessage'

export class ReverseProxy {
    public spyFunction: (sourceBody: string) => string =
                                                strBody => strBody
                                                .replace(new RegExp(this.remoteUrl, "igm"), "localhost:" + this.port)
                                                .replace(new RegExp("(https)([\:\\\/\%\w\.]+localhost)", "igm"), "http$2")
    public static readonly PORT: number = 80
    public static readonly HOST: string = "browserleaks.com"
    private httpListener: http.Server
    private port: string | number
    private remoteUrl: string

    constructor() {
        this.config()
        this.startServer()
    }

    private config(): void {
        this.remoteUrl = process.env.REMOTE_HOST || process.argv[2] || ReverseProxy.HOST
        this.port = process.env.PORT || process.argv[3] || ReverseProxy.PORT
    }

    private startServer(): void {
        this.httpListener = http.createServer()
        this.httpListener.listeners("get")
        this.httpListener.listen(this.port).on("request",(req,res) => this.httpRequestHandler(req, res))
    }
    private httpRequestHandler(cliReq : IncomingMessage, cliRes:http.ServerResponse)  :void {
        const remoteReqHeaders = HeadersTransformer.fromReqest(cliReq.headers, this.remoteUrl)
        const options: https.RequestOptions = {
            "method": cliReq.method,
            "path": cliReq.url,
            "host" : this.remoteUrl,
            "headers": remoteReqHeaders
        }

        https.get(options
            , (remoteRes: IncomingMessage) =>  {
            let body = []
            let totalLength: number = 0
            console.group(
                    "\x1b[34m\x1b[2m" + this.remoteUrl + remoteRes.req.path + "\x1b[0m: >>",
                )
            remoteRes.on("data", (data: number[]) => {
                console.debug("   + chunk, length: " + data.length)
                totalLength += data.length
                
                if (body) {
                    body = [...body, ...data]
                }
                else {
                    body = [...data]
                }
            })

            remoteRes.on("error", (err) => {
                console.error(err)
            })

        remoteRes.on("end", () => {
            const remoteResHeaders:IncomingHttpHeaders = remoteRes.headers
            const resHeaders: OutgoingHttpHeaders = HeadersTransformer.fromResponse(remoteResHeaders)
            const contentEncoding: string = remoteResHeaders["content-encoding"]
            let pureBody: Buffer

            if (contentEncoding === "gzip") {
                pureBody = zlib.gunzipSync(Buffer.from([...body]))
            } else {
                pureBody = Buffer.from(body)
            }

            this.processResponse(remoteResHeaders, pureBody, resHeaders, cliRes, remoteRes, body)
            console.info("   client << " + JSON.stringify(resHeaders, null, 13))
            console.groupEnd()

        })
    })

    }

    private processResponse(remoteResHeaders: http.IncomingHttpHeaders, pureBody: Buffer, resHeaders: http.OutgoingHttpHeaders, cliRes: http.ServerResponse, remoteRes: IncomingMessage, body: any[]) {
        if (/text|script/.test(remoteResHeaders["content-type"])) {
            this.processTextResponse(cliRes, pureBody.toString('utf8'), resHeaders)
        }
        else {
            resHeaders["content-encoding"] =
                "none"||remoteResHeaders["content-encoding"]
            cliRes.writeHead(200, resHeaders)
            cliRes.end(Buffer.from(body))
        }
    }

    private processTextResponse(cliRes: http.ServerResponse, body: string, headers: http.OutgoingHttpHeaders) {
        const strBody = body.toString()
        const preview = strBody.substr(0, 100) + " ... " + strBody.substr(-100, 100)
        console.log(preview + " length: " + strBody.length)
        headers["content-encoding"] = "utf8"
        cliRes.writeHead(200, headers)
        cliRes.end(this.spyFunction(body))
    }

}
