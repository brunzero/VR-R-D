const { createServer } = require('http');
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
var socket = require('socket.io');
var videoPlayer;
var time = 0;
var userlist = {};
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
    userlist[socket.id.toString()] = {id: socket.id};
    userlist[socket.id.toString()].time = 0;
    userlist[socket.id.toString()].source = "Undetermined";

    io.emit('userconnected');

    socket.on('browserconfirm', (data)=>{
        webserverId = data.id
        userlist[socket.id.toString()].source = "Web";
        io.to(webserverId).emit('updateuserlist', {userlist: userlist});
        console.log("Webserver ID: ", webserverId);
    })

    socket.on('unityconfirm', (data)=>{
        userlist[socket.id.toString()].source = "Unity";
        io.to(webserverId).emit('updateuserlist', {userlist: userlist});
        console.log("Unity ID: ", data.id);
    })

    //video function
	socket.on('playvideo', (data)=>{
        console.log('Playing Video\nTitle:', data.video);
        var FPS = data.fps;
        var interval = 1/FPS*1000;
        if(!videoPlayer){
            videoPlayer = setInterval(()=>{
                time+=interval/1000;
                userlist[socket.id.toString()].time = time;
                io.emit('playvideounity', {
                    time: time
                });
                io.emit('getvideostatus', {
                    userlist: userlist,
                });
            }, interval);
        }
    });

    socket.on('resetvideo', ()=>{
        time = 0;
        userlist[socket.id.toString()].time = time;
        clearInterval(videoPlayer);
        videoPlayer = false;
        io.emit('getvideostatus', {
            userlist: userlist
        })
    });

    socket.on('updatevideotimeunity', (data)=>{
        userlist[socket.id.toString()].time = data.time;
    })

    socket.on('stopvideo', () => {
        console.log('Stopping Video');
        clearInterval(videoPlayer);
        videoPlayer = false;
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

    socket.on('disconnect', (data)=>{
        // var indexOfUser = userlist.findIndex((id)=>{
        //     return id == socket.id
        // })
        // userlist.splice(indexOfUser);
        delete userlist[socket.id.toString()];
    });
});





server.listen('4567', () => console.log('Server listening on PORT: 4567'))