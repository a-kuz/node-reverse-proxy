import * as http from "http";
export interface IncomingMessage extends http.IncomingMessage {
    req: ClientRequest;
}

export interface ClientRequest extends http.ClientRequest {
    path: string
}
