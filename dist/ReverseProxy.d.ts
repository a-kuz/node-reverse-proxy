import * as http from http
export declare class ReverseProxy {
    static readonly PORT: number;
    static readonly HOST: string;
    private httpsSender;
    private httpListener;
    private port;
    private remoteUrl;
    constructor();
    private config;
    private startServer;
    private httpRequestHandler;
}

export declare class IncomingMessage extends http.IncomingMessage {
    req: http.ClientReqest
}
//# sourceMappingURL=ReverseProxy.d.ts.map
