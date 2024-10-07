import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlaybackRef = useRef(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isPlayDisabled, setIsPlayDisabled] = useState(true);

  const startRecording = () => {
    audioPlaybackRef.current.src = null;
    const playBtn = document.getElementById("recordPlayBtn");
    playBtn.innerHTML = '<i class="fa fa-play"></i>';

    audioChunksRef.current = [];
    setAudioUrl(null);

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const playBtn = document.getElementById("recordPlayBtn");
          playBtn.disabled = true;

          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.start();
          setIsRecording(true);

          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            setAudioUrl(URL.createObjectURL(audioBlob));
            setIsRecording(false);
            setIsPlayDisabled(false);
          };
        })
        .catch((error) => {
          console.error("Error accessing microphone: ", error);
        });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const submitRecording = () => {
    if (audioUrl) {
      fetch(audioUrl)
        .then(response => response.blob())
        .then(audioBlob => {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.wav");

          axios.post("http://localhost:501/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
            .then(response => {
              console.log("Audio uploaded successfully:", response.data);
              setIsSubmitDisabled(true);
              setIsPlayDisabled(true);
              setAudioUrl(null);
            })
            .catch(error => {
              console.error("Error uploading audio:", error);
            });
        });
    }
  };

  const playRecording = () => {
    const audioPlayback = audioPlaybackRef.current;
    const playBtn = document.getElementById("recordPlayBtn");

    if (audioPlayback.paused) {
      audioPlayback.play();
      playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    } else {
      audioPlayback.pause();
      playBtn.innerHTML = '<i class="fa fa-play"></i>';
    }
  };

  const handlePlaybackEnd = () => {
    const playBtn = document.getElementById("recordPlayBtn");
    playBtn.innerHTML = '<i class="fa fa-play"></i>';
  };

  return (
    <div className="timeRange record-section">
      <button
        id="recordBtn"
        className="recordBtn icon-Btn"
        onClick={isRecording ? stopRecording : startRecording}
      >
        <i className={isRecording ? "fa fa-stop" : "fa fa-microphone"}></i>
      </button>

      <button
        id="recordPlayBtn"
        className="recordPlayBtn icon-Btn"
        onClick={playRecording}
        disabled={isPlayDisabled || !audioUrl}
      >
        <i className="fa fa-play recordPlayBtn-icon"></i>
      </button>

      <button
        id="recordSubmitBtn"
        className="recordSubmitBtn icon-Btn"
        onClick={submitRecording}
        disabled={!audioUrl || isSubmitDisabled}
      >
        <i className="fa fa-check recordSubmitBtn-icon"></i>
      </button>

      <audio
        id="audioPlayback"
        className="hidden"
        controls
        style={{ display: "none" }}
        ref={audioPlaybackRef}
        src={audioUrl}
        onEnded={handlePlaybackEnd}
      ></audio>
    </div>
  );
};

export default AudioRecorder;
