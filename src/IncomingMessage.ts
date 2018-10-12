import * as http from "http";
export interface IncomingMessage extends http.IncomingMessage {
    req: http.ClientRequest;
}
