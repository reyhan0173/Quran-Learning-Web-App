let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;

function startRecording() {
  // Clear the audio blob and URL
  audioBlob = null;
  audioUrl = null;

  // Reset audioChunks to start a new recording
  audioChunks = [];

  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const playBtn = document.getElementById("recordPlayBtn");
        playBtn.disabled = true;
        
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const recordBtn = document.getElementById("recordBtn");
        recordBtn.innerHTML = '<i class="fa fa-stop"></i>';
        recordBtn.onclick = stopRecording;

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          // Create a Blob and URL for the audio data
          audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          audioUrl = URL.createObjectURL(audioBlob);

          // Update the audio playback element
          const audioPlayback = document.getElementById("audioPlayback");
          audioPlayback.src = audioUrl;

          // Change the stop button to record button
          const recordBtn = document.getElementById("recordBtn");
          recordBtn.innerHTML = '<i class="fa fa-microphone"></i>';
          recordBtn.onclick = startRecording;
      
          const playBtn = document.getElementById("recordPlayBtn");
          playBtn.disabled = false;
      
          // Enable submit button after stopping the recording
          document.getElementById("recordSubmitBtn").disabled = false;
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone: ", error);
      });
  }
}

function playRecording() {
  const audioPlayback = document.getElementById("audioPlayback");
  const playBtn = document.getElementById("recordPlayBtn");

  if (audioPlayback.paused) {
    audioPlayback.play();
    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
  } else {
    audioPlayback.pause();
    playBtn.innerHTML = '<i class="fa fa-play"></i>';
  }

  // When audio playback ends, change the button to a play icon
  audioPlayback.onended = function () {
    playBtn.innerHTML = '<i class="fa fa-play"></i>';
  };
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();

    const recordBtn = document.getElementById("recordBtn");
    recordBtn.innerHTML = '<i class="fa fa-microphone"></i>';
    recordBtn.onclick = startRecording;

    const playBtn = document.getElementById("recordPlayBtn");
    playBtn.disabled = false;
  }
}

function submitRecording() {
  if (audioBlob) {
    // Handle the audio submission
    console.log("Audio submitted");

    // Reset the buttons
    document.getElementById("recordSubmitBtn").disabled = true;
    document.getElementById("recordPlayBtn").disabled = true;

    // Clear the audio blob and URL
    audioBlob = null;
    audioUrl = null;
  }
}
