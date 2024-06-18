import React, { useState, useRef } from "react";

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioPlaybackRef = useRef(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [isPlayDisabled, setIsPlayDisabled] = useState(true); // Disabled by default until audio is available

    const startRecording = () => {
        // Clear the audio playback URL
        audioPlaybackRef.current.src = null;
        const playBtn = document.getElementById("recordPlayBtn");
        playBtn.innerHTML = '<i class="fa fa-play"></i>'; // Change icon to pause when playing

        // Reset audio chunks and clear previous recordings
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
                        setIsPlayDisabled(false); // Enable the playback button after recording stops
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

    const playRecording = () => {
        const audioPlayback = audioPlaybackRef.current;
        const playBtn = document.getElementById("recordPlayBtn");

        if (audioPlayback.paused) {
            audioPlayback.play();
            playBtn.innerHTML = '<i class="fa fa-pause"></i>'; // Change icon to pause when playing
        } else {
            audioPlayback.pause();
            playBtn.innerHTML = '<i class="fa fa-play"></i>'; // Change icon to play when paused
        }
    };

    const submitRecording = () => {
        if (audioUrl) {
            // Handle the audio submission
            console.log("Audio submitted");

            // Disable the buttons
            setIsSubmitDisabled(true);
            setIsPlayDisabled(true);

            // Clear the audio blob and URL
            setAudioUrl(null);

            // Reset play button icon to play
            const playBtn = document.getElementById("recordPlayBtn");
            playBtn.innerHTML = '<i class="fa fa-play"></i>';
        }
    };

    const handlePlaybackEnd = () => {
        const playBtn = document.getElementById("recordPlayBtn");
        playBtn.innerHTML = '<i class="fa fa-play"></i>'; // Change icon to play when audio playback ends
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
                disabled={isPlayDisabled || !audioUrl} // Disable if no audioUrl or playback is disabled
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

            <button
                id="recordTrashBtn"
                className="recordTrashBtn icon-Btn"
                onClick={submitRecording}
                disabled={!audioUrl || isSubmitDisabled}
            >
                <i className="fa fa-trash recordTrashBtn-icon"></i>
            </button>

            <audio
                id="audioPlayback"
                className="hidden"
                controls
                style={{ display: "none" }}
                ref={audioPlaybackRef}
                src={audioUrl}
                onEnded={handlePlaybackEnd} // Call handlePlaybackEnd when audio playback ends
            ></audio>
        </div>
    );
};

export default AudioRecorder;
