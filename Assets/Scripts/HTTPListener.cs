using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System;

public class HTTPListener : MonoBehaviour {

    HttpListener listener = new HttpListener();
	// Use this for initialization
	void Start () {
        listener.Prefixes.Add("http://*:8080/");
        listener.Start();
        IAsyncResult result = listener.BeginGetContext(new AsyncCallback(ListenerCallback), listener);
        // Applications can do some work here while waiting for the 
        // request. If no work can be done until you have processed a request,
        // use a wait handle to prevent this thread from terminating
        // while the asynchronous operation completes.
        //Console.WriteLine("Waiting for request to be processed asyncronously.");
        //result.AsyncWaitHandle.WaitOne();
        //Console.WriteLine("Request processed asyncronously.");
        listener.Close();
    }

    private void ListenerCallback(System.IAsyncResult ar) {
        Debug.Log(ar.IsCompleted);
        Debug.Log(ar.AsyncState);
        throw new NotImplementedException();
    }

    // Update is called once per frame
    void Update () {
		
	}
}
