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
            "content-encoding",
            "content-type",
        ];

    public static fromIncomingToOutgoing(clientHeaders: IncomingHttpHeaders, fakeHost:string): OutgoingHttpHeaders {
        const fakeHeaders: OutgoingHttpHeaders = clientHeaders
        fakeHeaders.host = fakeHost
        fakeHeaders.Host = fakeHost
        return fakeHeaders
    }
}
