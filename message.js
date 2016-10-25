var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(7000);

function handler (req, res) {
}

io.on('connection', function (socket) {
    socket.on('my other event', function (data) {
        socket.broadcast.emit('news', data);
    });
    socket.on('video', function (data) {
        console.log(data);
        socket.broadcast.emit('appvideo', data);
    });
});