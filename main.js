
'use strict';

// Put variables in global scope to make them available to the browser console.
const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('#imgcaplayer');
//const canvasOverlay = window.canvas = document.querySelector('#drawlayer');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//canvasOverlay.width = window.innerWidth;
//canvasOverlay.height = window.innerHeight;
//  document.querySelector("#imgcaplayer").style.visibility = "hidden";
//document.getElementById("imgcaplayer").style.zIndex = "10";
//document.querySelector("canvas").style.zIndex = "0";
//console.log("z-init is: "+document.getElementById("imgcaplayer").style.zIndex)

setInterval(function () {document.getElementById("myButtonId").click();}, 10000);

const button = document.querySelector('button');
button.onclick = function() {


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL(); //read a single image into dataURL variable    
    var temp = dataURL.replace("data:image/png;base64,", ""); // Verify your base64 data converts correctly to PNG https://onlinepngtools.com/convert-base64-to-png
    
    
    //console.log('+++ dataUrl:', temp);
         
          var request = new XMLHttpRequest();
          //Send the proper header information along with the request
          var formDataA = new FormData(document.forms[0]);
          var form_data = new FormData(document.forms[0]);
          formDataA.append('key1', 'value1');
          formDataA.append('image', temp);
          form_data.append('image', temp);
          
          /*request.open('POST', 'https://httpbin.org/post', false);
          request.send(formDataA);
          console.log("data from formDatA...", request.response);
          request.open('POST', 'https://httpbin.org/post', false);
          request.send(form_data);
          console.log("data from form_data...", request.response);*/
          request.open('POST', 'http://localhost:8080/facebox/check/', false);
          request.setRequestHeader("Content-Type", "multipart/form-data");
          //request.setRequestHeader("Accept", "application/json; charset=utf-8");
          request.send(formDataA);
          console.log(request.response);

          /*
    var xhr = new XMLHttpRequest(document.forms[0]);
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', 'https://httpbin.org/post', true); //http://localhost:8080/facebox/check/ https://httpbin.org/post
    xhr.send();
    console.log("xhr.response ...",xhr.response);
     */

    var Boxx = JSON.parse(response.response).rects;
    console.log(Boxx); 
    var x1 = Boxx[0][0]; 
    var y1 = Boxx[0][1];
    var x2 = Boxx[0][2];
    var y2 = Boxx[0][3];

    // Draw Rectangles 
    canvas.getContext('2d').fillStyle = '#8bef69'; // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
    canvas.getContext('2d').fillRect(x1, y1, x2-x1, y2-y1);
    // Scroll to the new blocked face image
    //
    document.getElementById("block").scrollIntoView();
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);