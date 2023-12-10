import { useState, useRef } from "react";

// Declare the variable mimeType outside the component’s function scope (because we don’t need it to re-render as component state updates)
// const mimeType = "audio/webm";
const mimeType = "video/mp4;codecs=avc1";   // variable sets the desired file type

const AudioRecorder = () => {
    // Declare the following state variables inside the AudioRecorder component scope:
    // permission uses a Boolean value to indicate whether user permission has been given
    // mediaRecorder holds the data from creating a new MediaRecorder object, given a MediaStream to record
    // recordingStatus sets the current recording status of the recorder. The three possible values are recording, inactive, and paused
    // stream contains the MediaStream received from the getUserMedia method
    // audioChunks contains encoded pieces (chunks) of the audio recording
    // audio contains a blob URL to the finished audio recording
	const [permission, setPermission] = useState(false);
	const mediaRecorder = useRef(null);
	const [recordingStatus, setRecordingStatus] = useState("inactive");
	const [stream, setStream] = useState(null);
	const [audio, setAudio] = useState(null);
	const [audioChunks, setAudioChunks] = useState([]);

    {/* Receives microphone permissions from the browser using the getMicrophonePermission function  */}
	const getMicrophonePermission = async () => {
		if ("MediaRecorder" in window) {
            // Sets MediaStream received from the navigator.mediaDevices.getUserMedia function to the stream state variable
			try {
				const mediaStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				setPermission(true);
				setStream(mediaStream);
			} catch (err) {
				alert(err.message);
			}
		} else {
			alert("The MediaRecorder API is not supported in your browser.");
		}
	};

	const startRecording = async () => {
		setRecordingStatus("recording");
		const media = new MediaRecorder(stream, { type: mimeType });

		mediaRecorder.current = media;

		mediaRecorder.current.start();

		let localAudioChunks = [];

		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};

	const stopRecording = () => {
		setRecordingStatus("inactive");
		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			const audioUrl = URL.createObjectURL(audioBlob);

			setAudio(audioUrl);

			setAudioChunks([]);
		};
	};

	return (
        /* Declares the UI for the audio recorder components */
		<div>
			<h2>Audio Recorder</h2>
			<main>
				<div className="audio-controls">
					{!permission ? (
						<button onClick={getMicrophonePermission} type="button">
							Get Microphone
						</button>
					) : null}
                    {/* conditionally render the start/stop recording buttons depending on the recordingStatus state */}
					{permission && recordingStatus === "inactive" ? (
						<button onClick={startRecording} type="button">
							Start Recording
						</button>
					) : null}
					{recordingStatus === "recording" ? (
						<button onClick={stopRecording} type="button">
							Stop Recording
						</button>
					) : null}
				</div>

                {/* Playback and audio download */}
                {/* To play back the recorded audio file, we’ll use the HTML audio tag. */}
				{audio ? (
					<div className="audio-player">
						<audio src={audio} controls></audio>
                        {/* Linking the blob from the recording to the anchor element and adding the download attribute makes it downloadable. */}
						<a download href={audio}>
							Download Recording
						</a>
					</div>
				) : null}
			</main>
		</div>
	);
};

export default AudioRecorder;