/**
 * Created by Uran on 2017. 5. 17..
 */
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(4000);

const savedDrawingData = [];

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}
/**
 * 사용자가 웹사이트에 접속하게 되면 'connection' 이벤트가 생성되고 또 그 사용자에 대한 socket 오브젝트가 생성됨
 * 나머지 이벤트들은 이 connection 이벤트 안에서 정의해야 함
 */
var count = 1;

io.on('connection', function (socket) {
    // Send Saved Data
    setTimeout(function () {
        socket.emit('preDrawing', savedDrawingData);
    }, 1000);

    socket.on('drawing', function (data) {
        console.log(data);
        socket.broadcast.emit('drawing', data);

        if (data.type === 'beginPath') {
            savedDrawingData.push([]);
        }

        savedDrawingData[savedDrawingData.length - 1].push(data);
    });

    socket.on('clear', function () {
        savedDrawingData.length = 0;
        io.emit('clear')
    });

    socket.on('sendMessage', function (data) {
        socket.broadcast.emit('receiveMessage', data);
    });

});
