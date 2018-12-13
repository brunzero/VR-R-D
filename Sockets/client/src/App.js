import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
var socket = io('localhost:4567', {
  path: '/test',
  transports: ['websocket']
});

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      videotitle: 'chronotrigger',
      fps: 60,
      currenttimeserver: 0,
      currenttimeclient: 0,
      timedifference: 0,
      userlist: [],
      socketid: 0
    }
  }

  componentDidMount(){
    socket.on('connect', ()=>{
      this.setState({
        socketid: socket.id
      })
      console.log(this.state.socketid);
    })
    socket.on('getvideostatus', (data)=>{
      this.setState({
        currenttimeserver: data.time
      })
    });
    socket.on('userconnected', (data)=>{
      this.setState({
        userlist: data.userlist
      })
      console.log(this.state.userlist);
      },
      //ack
      ()=>{
        "yo"
      }
    )
  }

  pauseVideo(){
    socket.emit('stopvideo');
  }

  playVideo(){
    socket.emit('playvideo', {
        video: this.state.videotitle,
        fps: this.state.fps
      });
  }

  render() {
    return (
      <div className="App">
        <label> Video Title{' '}
          <input type="text" value={this.state.videotitle} onChange={(e)=>{this.setState({videotitle: e.target.value})}}></input>
        </label>
        <br/>
        <label> Video FPS{' '}
          <input type="number" value={this.state.fps} onChange={(e)=>{this.setState({fps: e.target.value})}}></input>
        </label>
        <br/>
        <button onClick={()=>this.playVideo()}>Play</button>
        <button onClick={()=>this.pauseVideo()}>Pause</button>
        <br/>
        <label>Current Time On Server: {this.state.currenttimeserver}</label>
        <br/>
        <label>Current Time On Client: {this.state.currenttimeclient}</label>
        <br/>
        <label>Difference: {this.state.timedifference}</label>
        <br/> <br/>
        <label>Users</label>
        {this.state.userlist.map((user)=>{
          if(user)
          return(
          <div key={user}>
            <label className="user-in-list">
              {user}
            </label>
            {(user == this.state.socketid) ? <label> Web Client</label> : <label> Unity Client</label>}
          </div>
          )
        })}
      </div>
    );
  }
}

export default App;
