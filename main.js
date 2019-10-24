'use strict';

function waitReady(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function makeRequest(url, method, data=null) {
    var request = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
        // Setup our listener to process compeleted requests
        request.onreadystatechange = function () {
            // Only run if the request is complete
            if (request.readyState !== 4) return;

            // Process the response
            if (request.status >= 200 && request.status < 300) {
                resolve(request);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.open(method || 'GET', url, true);
        request.send(data);
    });
};

waitReady(() => {
    const video = document.querySelector('video');
    const snapshotButton = document.getElementById('btn-snapshot');
    const captureCanvas = document.getElementById('img-capture-canvas');
    const overlayCanvas = document.getElementById('draw-canvas');

    snapshotButton.addEventListener('click', (e) => {
        const width = captureCanvas.width = overlayCanvas.width = video.videoWidth;
        const height = captureCanvas.height = overlayCanvas.height = video.videoHeight;
        captureCanvas.getContext('2d').drawImage(video, 0, 0, width, height);
        const temp = captureCanvas.toDataURL().replace("data:image/png;base64,", ""); // Verify your base64 data converts correctly to PNG https://onlinepngtools.com/convert-base64-to-png

        //Send the proper header information along with the request
        const formData = new FormData(document.forms[0]);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('image', temp);

        makeRequest('/facebox/check/', 'POST', formData).then((request) => {
            const response = request.response;
            console.log(response);

            const {x1, y1, x2, y2} = JSON.parse(response);

            // Draw Rectangles
            overlayCanvas.getContext('2d').fillStyle = '#8bef69'; // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
            overlayCanvas.getContext('2d').fillRect(x1, y1, x2 - x1, y2 - y1);
        }).catch((error) => {
            console.log('Error occurred in request: ', error);
        });
    });

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
        };
    }).catch((error) => { console.log('navigator.getUserMedia error: ', error); });
});
