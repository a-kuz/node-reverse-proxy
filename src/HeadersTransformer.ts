import {IncomingHttpHeaders, OutgoingHttpHeaders} from "http"

export class HeadersTransformer {
    public static readonly reqiedHeaders: string[] =
        [
            "connection",
            "host",
            "path",
            "content-type",
            "transfer-encoding",
            "user-agent",
            "content-encoding"
        ];

    public static fromReqest(clientHeaders: IncomingHttpHeaders, fakeHost:string): OutgoingHttpHeaders {
        const fakeHeaders: OutgoingHttpHeaders = clientHeaders
        Object.keys(clientHeaders)
            .filter(e => HeadersTransformer.reqiedHeaders.includes(e))
            .forEach(e => fakeHeaders[e] = clientHeaders[e]);
        fakeHeaders.host = fakeHost
        return fakeHeaders
    }

    public static fromResponse(serverHeaders:IncomingHttpHeaders):OutgoingHttpHeaders {
        const resHeaders: OutgoingHttpHeaders = {};
        Object.keys(serverHeaders)
            .filter((e) => HeadersTransformer.reqiedHeaders.includes(e))
            .forEach((e) => (resHeaders[e] = serverHeaders[e]));
        return resHeaders
    }

}
