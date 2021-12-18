import './Recorder.css'
import React from 'react';
import ReactDom from 'react-dom';
import axios from "axios";

const ScreenRecording = () => {
  
  var strName = null;
  var strEmail = null;
  const video = document.getElementById('video');
  const screen = document.getElementById('screen');

  async function captureMediaDevices(mediaConstraints = {
      video: {
        width: 1280,
        height: 720
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }) {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    
    video.src = null;
    video.srcObject = stream;
    video.muted = true;
    
    return stream;
  }
  
  async function captureScreen(mediaConstraints = {
      video: {
        cursor: 'always',
        resizeMode: 'crop-and-scale'
      }
    }) {
    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    
    return screenStream;
  }
  
  let recorder1 = null;
  let recorder2 = null;
  var strFile1 = null;
  var strFile2 = null;
  var screenblob = null;
  var webcamblob = null;
  let screenOnly = true;
  let webcamOnly = false;

  function stopRecording() {
    recorder1.stream.getTracks().forEach(track => track.stop());
   if((screenOnly==false) && (webcamOnly==false)) 
    recorder2.stream.getTracks().forEach(track => track.stop());
  }

  async function recordScreen() {
    screenOnly = true;
    webcamOnly = false;
    const screenStream = await captureScreen();
    const audioStream = await captureMediaDevices({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false
    });
    const videoStream = await captureMediaDevices({
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    });

    const stream1 = new MediaStream([...screenStream.getTracks(),...audioStream.getTracks()]);
    const stream2 = new MediaStream(videoStream);

    screen.src = null;
    screen.srcObject = stream1;
    screen.muted = true;
    screen.autoplay = true;
    video.src = null;
    video.srcObject = stream2;
    video.muted = true;
    video.autoplay = true;

    recorder1 = new MediaRecorder(stream1);
    let chunks1 = [];
  
    recorder1.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks1.push(event.data);
      }
    }
    
    recorder1.onstop = () => {
      const blob = new Blob(chunks1, {
        type: 'video/webm'
      })
      chunks1 = [];
      screenblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile1 = blobUrl;
      
      const tracks = stream2.getTracks();
      tracks.forEach(function(track) {
        track.stop();
      });

     }
     recorder1.start(200);
  }
  
  async function recordScreenVideoAudio() {
    screenOnly = false;
    webcamOnly = false;
    const screenStream = await captureScreen();
    const videoStream = await captureMediaDevices({
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    });
    const audioStream = await captureMediaDevices({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false
    });
    
    const stream1 = new MediaStream([...screenStream.getTracks(),...audioStream.getTracks()]);
    const stream2 = new MediaStream([...videoStream.getTracks(),...audioStream.getTracks()]);
    
    screen.src = null;
    screen.srcObject = stream1;
    screen.muted = true;
    screen.autoplay = true;
    video.src = null;
    video.srcObject = stream2;
    video.muted = true;
    video.autoplay = true;
    
    recorder1 = new MediaRecorder(stream1);
    recorder2 = new MediaRecorder(stream2);
    let chunks1 = [];
    let chunks2 = [];
  
    recorder1.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks1.push(event.data);
      }
    }
    
    recorder1.onstop = () => {
      const blob = new Blob(chunks1, {
        type: 'video/webm'
      })
      chunks1 = [];
      screenblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile1 = blobUrl;

     }

    recorder2.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks2.push(event.data);
      }
    }
    
    recorder2.onstop = () => {
      const blob = new Blob(chunks2, {
        type: 'video/webm'
      })
      chunks2 = [];
      webcamblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile2 = blobUrl;
  
     }
    recorder1.start(200);
    recorder2.start(200);
  }

  async function recordVideo() {
    screenOnly = false;
    webcamOnly = true;
    const videoStream = await captureMediaDevices({
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    });
    const audioStream = await captureMediaDevices({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false
    });
 
    const stream1 = new MediaStream([...videoStream.getTracks(),...audioStream.getTracks()]);
    
    screen.src = null;
    screen.srcObject = stream1;
    screen.muted = true;
    screen.autoplay = true;
    
    recorder1 = new MediaRecorder(stream1);
    let chunks1 = [];
  
    recorder1.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks1.push(event.data);
      }
    }
    
    recorder1.onstop = () => {
      const blob = new Blob(chunks1, {
        type: 'video/webm'
      })
      chunks1 = [];
      webcamblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile1 = blobUrl;

     }

    recorder1.start(200);
  }

  const previewRecording = () => {
    if ((screenOnly == false) && (webcamOnly == false))
    {
      screen.srcObject = null;
      screen.src = strFile1;
      screen.muted = true;
      screen.autoplay = true;
      video.srcObject = null;
      video.src = strFile2;
      video.muted = false;
      video.autoplay = true;
    }
    else if ((screenOnly == true) && (webcamOnly == false))
    {
      screen.srcObject = null;
      screen.src = strFile1;
      screen.muted = false;
      screen.autoplay = true; 
    }
    else if ((screenOnly == false) && (webcamOnly == true))
    {
      screen.srcObject = null;
      screen.src = strFile1;
      screen.muted = false;
      screen.autoplay = true;
    }
  }
 
  const uploadRecording = () => {

    strName = document.getElementById("name").value;
    strEmail = document.getElementById("email").value;
    alert("name: "+strName);
    alert("email: "+strEmail);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    
    const formData = new FormData();

    // Update the formData object
    if(webcamOnly == false)
    {
      formData.append("file2upload1", screenblob);
      if(screenOnly == false)
      {
        formData.append("file2upload2", webcamblob);
      }
    }
    else if(webcamOnly == true)
    {
      formData.append("file2upload2", webcamblob);
    }
    formData.append("email", strEmail);
    formData.append("name", strName);

    // Request made to the backend api
    // Send formData object
    axios.post("https://balaji.today/upload53.php/multiplefiles", formData,{headers:{"Content-Type": "multipart/form-data"}});

    // Clear Object URL and blob
    cleardata();

    alert("Upload success");
  }

  const cleardata = () => {
    if((screenOnly == false) && (webcamOnly == false))
    {
      URL.revokeObjectURL(strFile1);
      screenblob = null;
      URL.revokeObjectURL(strFile2);
      webcamblob = null;
    }
    else if((screenOnly == true) && (webcamOnly == false))
    {
      URL.revokeObjectURL(strFile1);
      screenblob = null;
    }
    else if((screenOnly == false) && (webcamOnly == true))
    {
      URL.revokeObjectURL(strFile1);
      webcamblob = null;
    }
  }

  return(
      <center>
      <div>
        <button onClick={recordScreen}>Record screen with voice</button>
        <button onClick={recordScreenVideoAudio}>Record Screen with video</button>
        <button onClick={recordVideo}>Record video</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={previewRecording}>Replay</button>
        <button onClick={uploadRecording}>Upload and close</button>
      </div>
      </center>
  )
}
function Video(){
  return (<div className="Display">
            <center>
              <video id='screen' className="Display-screen" width="800" height="600" autoplay muted></video>
              <video id='video' className="Display-video" width="160" height="120" autoplay muted></video>
            </center>
          </div>)
}

ReactDom.render(
  <React.StrictMode>
  <Video />
  </React.StrictMode>,
  document.getElementById('vid')
);

export default ScreenRecording;