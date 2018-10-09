const http = require('http');
const https = require('https');
const net = require('net');
const url = require('url');
const port = 1337;
var data;

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
});
proxy.on('connect', (req, cltSocket, head) => {
    // connect to an origin server
    const srvUrl = url.parse(`http://${req.url}`);
    const srvSocket = net.connect(port, 'localhost', () => {
        let s = JSON.stringify(req.headers).replace('{', '').replace('}', '').replace('","', '\r\n').replace(/""/igm, '"')
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            'Proxy-agent: Node.js-Proxy\r\n' +
            'Path: ' +
            '\r\n');
        srvSocket.write(head);
        srvSocket.pipe(cltSocket);
        cltSocket.pipe(srvSocket);
    });
});

// now that proxy is running
proxy.listen(port, '127.0.0.1', () => {

    // make a request to a tunneling proxy
    const options = {
        port: port,
        hostname: '127.0.0.1',
        method: 'CONNECT',
        path: ''
    };

    const req = http.request(options);
    req.end();

    req.on('connect', (res, socket, head) => {
        console.log('got connected!');

        https.get('https://browserleaks.com' + head.path, (res) => {
        //console.log(JSON.stringify(res))
        var header = res.rawHeaders
        var respo = res
        res.on('data', (d) => {
            data=d
            process.stdout.write(d)

            // const srvSocket = net.connect(port, srvUrl.hostname, () => {
            //     // console.log(d)
            //     // console.log(typeof (d))
            // cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
            //     'Proxy-agent: Node.js-Proxy\r\n')
            //     let s = JSON.stringify(respo.headers).replace('{', '').replace('}','').replace('","', '\r\n').replace(/["]*/igm, '')
            //     cltSocket.write(s)
            //     cltSocket.write(data)
            //     cltSocket.end()

        })

        })
    })
        // // make a request over an HTTP tunnel
        // socket.write('GET /\r\n' +
        //     'Host: browserleaks.com:443\r\n' +
        //     'Connection: close\r\n' +
        //     '\r\n');
        // socket.on('data', (chunk) => {

        //     data = chunk.toString()
        //     console.log(data);
        // });
        // socket.on('end', () => {
        //     //proxy.close();
        // });
    });
//});
