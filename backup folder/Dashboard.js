import React, { useRef, useState, useEffect } from "react";
import "../styles/Dashboard.css";
import growImage from "../assets/dashboard.jpg";

function Dashboard() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef(null);

  const formatTime = (ms) => {
    const date = new Date(ms);
    return (
      date.toISOString().substr(11, 8) +
      "." +
      String(ms % 1000).padStart(3, "0")
    );
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(blob);
      stream.getTracks().forEach((track) => track.stop());
      clearInterval(timerIntervalRef.current);

      sendVideoForPrediction(blob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setTimer(0);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 100);
    }, 100);
  };

  const stopCamera = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);

    // Add a slight delay to ensure blob is fully set
    // setTimeout(() => {
    //   sendVideoForPrediction();
    // }, 500);
  };

  const retake = () => {
    setVideoBlob(null);
    setIsRecording(false);
    setTimer(0); 
    startCamera();
  };

  const sendVideoForPrediction = async (blob) => {
    if (!blob) {
      alert("No video recorded yet.");
      return;
    }

    const formData = new FormData();
    formData.append("video", blob, "input_video.webm");

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Predicted Emotion: ${result.predicted_emotion}`);
        console.log("Full distribution:", result.full_distribution);
      } else {
        alert(result.error || "Prediction failed.");
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("An error occurred while predicting emotion.");
    }
  };

  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current); // Cleanup on unmount
  }, []);

  return (
    <div className="dashboard-container">
      <p className="note">
        🎥 We’ll now record your facial expressions to understand your emotional
        state. Please ensure at least 10 seconds of video.
      </p>

      {isRecording && (
        <p className="timer">
          ⏱️ Recording Time: <strong>{formatTime(timer)}</strong>
        </p>
      )}

      <video ref={videoRef} autoPlay muted className="video-frame" />

      <div className="button-group">
        {!isRecording && !videoBlob && (
          <button onClick={startCamera}>Start</button>
        )}
        {isRecording && <button onClick={stopCamera}>Stop</button>}
        {videoBlob && !isRecording && <button onClick={retake}>Retake</button>}
      </div>

      <div className="growth-image-container">
        <img src={growImage} alt="Grow Message" className="growth-image" />
      </div>
    </div>
  );
}

export default Dashboard;
