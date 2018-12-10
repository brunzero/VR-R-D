using System.Collections;
using UnityEngine;
using SocketIO;
using UnityEngine.Video;

public class RemoteVideoSelector : MonoBehaviour {
    public UIVideoPlayer videoPlayerObject;
    private VideoPlayer videoPlayer;

    private SocketIOComponent socket;

    public void Start() {
        GameObject go = GameObject.Find("SocketIO");
        socket = go.GetComponent<SocketIOComponent>();
        videoPlayer = videoPlayerObject.GetComponent<VideoPlayer>();

        socket.On("open", SocketOpened);
        socket.On("close", SocketClosed);
        socket.On("error", SocketError);
        //socket.On("boop", (SocketIOEvent e) => { Debug.Log("boop"); });
        socket.On("playvideo", PlayVideo);
        socket.On("stopvideo", StopVideo);

        //StartCoroutine("BeepBoop");


    }

    public void PlayVideo(SocketIOEvent e) {
        //Debug.Log("Playing video: " + e.data.GetField("data").GetField("video"));
        //Debug.Log("From timestamp: " + e.data.GetField("data").GetField("timestamp"));
        //StartCoroutine(videoPlayerObject.PlayVideo());
        //Debug.Log("yoooooooooooooooooooo");
        //Debug.Log(e.data.GetField("data").f);
        videoPlayerObject.PlayVideoAtTime(e.data.GetField("data").f);
    }

    public void StopVideo(SocketIOEvent e) {
        Debug.Log("Stopping video: " + e.data);
        videoPlayerObject.PauseVideo();
    }

    public void SocketOpened(SocketIOEvent e) {
        Debug.Log("Socket has been opened: " + e.name + " " + e.data);
    }

    public void SocketClosed(SocketIOEvent e) {
        Debug.Log("Socket has been closed: " + e.name + " " + e.data);
    }

    public void SocketError(SocketIOEvent e) {
        Debug.Log("Socket error received: " + e.name + " " + e.data);
    }

}
