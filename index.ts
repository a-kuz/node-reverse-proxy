var net = require('net');

var REMOTE_ADDR = "89-serv"
    , REMOTE_PORT = 85;

var server = net.createServer(function (socket) {

    socket.on('data', function (message) {

        console.log('  ** START **');
        console.log('<< From client to proxy ', message.toString());

        var serviceSocket = new net.Socket();

        serviceSocket.connect(REMOTE_PORT, REMOTE_ADDR, function () {
            console.log('>> From proxy to remote', message.toString());
            serviceSocket.write(message);
        });

        serviceSocket.on('data', function (data) {
            console.log('<< From remote to proxy', data.toString());
            socket.write(data);
            console.log('>> From proxy to client', data.toString());
        });

    });

});

server.listen(80);
