/// <reference types="node" />
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";
export declare class HeadersTransformer {
    static readonly reqiedHeaders: string[];
    static fromIncomingToOutgoing(clientHeaders: IncomingHttpHeaders, fakeHost: string): OutgoingHttpHeaders;
}
//# sourceMappingURL=HeadersTransformer.d.ts.map