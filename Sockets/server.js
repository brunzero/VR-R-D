const { createServer } = require('http');
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
var socket = require('socket.io');

const server = createServer(app);
const io = socket(server, {
    path: '/test',
    transports: ['websocket']
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on('connection', function(socket){
	socket.on('playvideo', (data)=>{
        console.log('Playing Video\nTitle:', data.data.video);
        var time = 0;
        var FPS = 60;
        var interval = 1/FPS;
        setInterval(()=>{
            time+=interval/1000;
            io.emit('playvideo', {data: time})
            console.log(time);
        }, interval);
		//io.emit('playvideo', { data: data.data});
    });
    socket.on('stopvideo', () => {
        console.log('Stopping Video');
		io.emit('stopvideo');
    });
    socket.on('beep', ()=>{
        console.log("beeping, sending boop");
        socket.emit('boop');
    });
});

server.listen('4567', () => console.log('Server listening on PORT: 4567'))