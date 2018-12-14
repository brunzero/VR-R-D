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
      userlist: {},
      socketid: 0
    }
  }

  componentDidMount(){
    socket.on('connect', ()=>{
      this.setState({
        socketid: socket.id
      })
    });
    socket.on('getvideostatus', (data)=>{
      this.setState({
        userlist: data.userlist,
      })
    });
    socket.on('userconnected', (data)=>{
      socket.emit('browserconfirm', {id: socket.id});
    });
    socket.on('updateuserlist', (data)=>{
      this.setState({
        userlist: data.userlist
      })
    })
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

  resetVideo(){
    socket.emit('resetvideo');
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
        <button onClick={()=>this.resetVideo()}>Reset</button>
        <br/>
        <br/> <br/>
        <label>Users</label>
        {Object.keys(this.state.userlist).length > 0 && Object.keys(this.state.userlist).map((user)=>{
          return(
          <div key={user}>
            {(user == this.state.socketid) ? <label> Web Client</label> : <label> Unity Client</label>}
              <br/>
            <label className="user-in-list">
              {this.state.userlist[user].id}
              <br/>
            </label>
            <label className="user-in-list">
              Time: {this.state.userlist[user].time}
              <br/>
            </label>
          </div>
          )
        })}
      </div>
    );
  }
}

export default App;
