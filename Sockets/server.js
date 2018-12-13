const { createServer } = require('http');
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
var socket = require('socket.io');
var videoPlayer;
var time = 0;
var userlist = [];
var webserverId; 

const server = createServer(app);
const io = socket(server, {
    path: '/test',
    transports: ['websocket']
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on('connection', (socket)=>{
    //add user to the current list of users and tell the web client
    userlist = [...userlist, socket.id];
    io.emit('userconnected', {userlist: userlist});
    console.log("/************************** Current User List **************************/ \n" + userlist);

    //video function
	socket.on('playvideo', (data)=>{
        console.log('Playing Video\nTitle:', data.video);
        var FPS = data.fps;
        var interval = 1/FPS*1000;
        videoPlayer = setInterval(()=>{
            time+=interval/1000;
            io.emit('playvideo', {
                time: time
            });
            io.emit('getvideostatus', {
                time: time
            });
        }, interval);
    });
    socket.on('stopvideo', () => {
        console.log('Stopping Video');
        clearInterval(videoPlayer);
		io.emit('stopvideo');
    });
    socket.on('beep', ()=>{
        console.log("beeping, sending boop");
        socket.emit('boop');
    });

    //reconnect and disconnect
    socket.on('reconnect_attempt', () => {
        socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('disconnect', (socket)=>{
        var indexOfUser = userlist.findIndex((id)=>{
            return id == socket.id
        })
        userlist.splice(indexOfUser);
    });
});





server.listen('4567', () => console.log('Server listening on PORT: 4567'))