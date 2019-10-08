
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

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
};


const button = document.querySelector('button');
button.onclick = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
 
    var dataURL = canvas.toDataURL(); //read a single image into dataURL variable
      var blob = dataURItoBlob(dataURL);
      var fd = new FormData(document.forms[0]);
      fd.append("canvasImage",blob);
    var temp = dataURL.replace("data:image/png;base64,", ""); // Verify your base64 data converts correctly to PNG https://onlinepngtools.com/convert-base64-to-png
    console.log('+++ dataUrl:', temp)
    var form_data = new FormData(document.forms[0]);
    form_data.append("image", temp);
  
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', '/', true); //http://localhost:8080/facebox/check/
    xhr.send(form_data);

    var Boxx = JSON.parse(xhr.response).rects;
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