var fs = require('fs');
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
var app = require('https').createServer(options, handler)
var io = require('socket.io')(app);
var exec = require('child_process').exec;

app.listen(7000);

function handler (req, res) {
}

var videoInfo = {
    url: "",
    text: ""
};

io.on('connection', function (socket) {
    socket.on('test connect', function (data) {
        console.log("hihihihihihihihihihihihihihihihihihihihihihh");
    });
    socket.on('auto go', function (data) {
        exec("python /Users/tongguwei/frontprojects/automac/index.py", function (error, stdout, stderr) {
            socket.emit("anu go comelete");
        });
    });
    socket.on('translate', function (data) {
        videoInfo.text = data.text;
        exec("python /Users/tongguwei/frontprojects/automac/text.py", function (error, stdout, stderr) {
        });
    });
    socket.on('what i need to translate', function (data) {
        socket.emit("this is your translate data", {
            text: videoInfo.text
        });
    });
    socket.on('i have translate', function (data) {
        videoInfo = data;
    });
    socket.on('what i have videoinfo', function (data) {
        socket.emit("this is your videoinfo", videoInfo);
    });
});