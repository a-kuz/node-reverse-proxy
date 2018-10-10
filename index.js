const options = ["connection", "host", "path", "User-Agent", "content-type"];
const reqHeaders = ["connection", "host", "path", "User-Agent", "content-type", "transfer-encoding", "user-agent",
    "content-encoding", 'content-type'
];
const remoteUrl = (process.argv[2] || "browserleaks.com");
//import { createServer } from 'net';
// import * as net from 'net';
// import { } from "https";
// import * as http from "http";
// import {
//     unzipSync
// } from 'zlib';
imp;
const s = net.createServer(socket => {
    console.log(socket);
});
s.listen(81, "localhost", (listener, l2) => {
    console.log(listener);
});
const server = http.createServer();
server.listen(81);
server.on('request', (cliReq, cliRes) => {
    let headers = cliReq.headers.valueOf();
    headers.host = remoteUrl;
    let headerKeys = Object.keys(headers).filter(k => k != 'cookie');
    let cliHeaders = {};
    headerKeys.forEach(key => {
        cliHeaders[key] = headers[key].replace('localhost', remoteUrl);
    });
    cliHeaders['user-agent'] = 'Hello from ts-node';
    let options = {
        hostname: remoteUrl,
        path: cliReq.url,
        method: cliReq.method,
        headers: cliHeaders
    };
    // opt = remoteUrl + '/' + cliReq.url
    //remoteRes.setEncoding("utf8");
    https.
        https.get(options, remoteRes => {
        var body = [];
        remoteRes.on("data", data => {
            console.log("   + chunk, length: " + data.length);
            body = body.concat([...data]);
        });
        //    body;
        remoteRes.on("error", (err) => {
            console.error(err);
        });
        remoteRes.on("end", () => {
            let remoteResHeaders = remoteRes.headers;
            let h = JSON.stringify(remoteResHeaders, [String.fromCharCode(13)]);
            let pureBody;
            if ((remoteResHeaders["content-encoding"] || '') == 'gzip') {
                pureBody = unzipSync(Buffer.from(body));
            }
            else {
                pureBody = body;
            }
            console.info("\x1b[34m\x1b[2m" + remoteUrl + remoteRes.req.path + "\x1b[0m: >>");
            var resHeaders = {};
            Object.keys(remoteRes.headers).filter(e => reqHeaders.includes(e)).forEach(e => resHeaders[e] = remoteRes.headers[e]);
            if (/text|script/.test(remoteRes.headers["content-type"])) {
                let strBody = pureBody.toString(); //body.reduce((pervios,current) =>*() {String.fromCharCode(pervios)}a)
                let preview = strBody.substr(0, 100) + " ... " + strBody.substr(-100, 100);
                console.log(preview + ' length: ' + strBody.length);
                //resHeaders = {}
                //resHeaders['content-type'] = 'text/html; charset=UTF-8'
                resHeaders['content-encoding'] = 'utf8';
                console.info("   client << " + JSON.stringify(resHeaders, null, 13));
                cliRes.writeHead(200, resHeaders);
                let fakeBody = strBody.replace(new RegExp(remoteUrl, 'igm'), 'localhost');
                if (fakeBody != strBody) {
                    console.log(fakeBody);
                }
                cliRes.end(fakeBody);
            }
            else {
                console.info("body.length: " + body.length);
                resHeaders['content-type'] = remoteRes.headers['content-type'];
                //`resHeaders['content-type'] = remoteRes.headers['content-type']
                if (remoteRes.headers['content-encoding']) {
                    resHeaders['content-encoding'] = remoteRes.headers['content-encoding'];
                }
                console.info("   client << " + JSON.stringify(resHeaders, null, 13));
                cliRes.writeHead(200, resHeaders);
                cliRes.end(Buffer.from(body));
            }
        });
    });
});
// global.
