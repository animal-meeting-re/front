"use strict";

// Create a video element dynamically
const videoElement = document.createElement("video");
videoElement.setAttribute("playsinline", "");
videoElement.setAttribute("autoplay", "");
videoElement.style.width = "100%";
videoElement.style.height = "auto";

// Append the video element to the body
document.body.appendChild(videoElement);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function start() {
  const constraints = {
    video: true, // Only request video
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

// Start the video stream
start();
