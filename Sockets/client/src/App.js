import React, { Component } from 'react';
import logo from './logo.svg';
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
      timedifference: 0
    }
  }

  componentDidMount(){
    socket.emit('beep');
    socket.on('boop', ()=>{
      console.log("boop");
    })
    socket.on('getvideostatus', (data)=>{
      this.setState({
        currenttimeserver: data.data.time
      })
    })
  }

  pauseVideo(){
    socket.emit('stopvideo');
  }

  playVideo(){
    socket.emit('playvideo', {data: {
        video: this.state.videotitle,
        fps: this.state.fps
      } 
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
      </div>
    );
  }
}

export default App;
