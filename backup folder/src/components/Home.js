import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);

  const handleCapture = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "capture.webm");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert("Predicted Emotion: " + result.emotion);

      stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000); // Record for 5 seconds
  };

  return (
    <div className="home-wrapper">
      <div className="overlay" />

      {/* ✅ Custom hamburger icon */}
      <div className="custom-hamburger" onClick={() => navigate("/")}>
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" className="toggle">
          <div className="bars" id="bar1"></div>
          <div className="bars" id="bar2"></div>
          <div className="bars" id="bar3"></div>
        </label>
      </div>

      <div className="home-heading-container">
        <h1 className="home-heading">Bloom Well</h1>
        <p className="home-tagline">
          – When things change inside you, things change around you
        </p>
      </div>

      <div className="home-main-content">
        <section className="home-intro fade-in">
          <p>
            Welcome to <strong>Bloom Well</strong> – an AI-powered platform
            dedicated to helping you track emotional well-being through facial
            expression analysis. Whether you're checking in with yourself or
            supporting others, our tools offer insight and awareness that
            matter.
          </p>
        </section>

        <section className="home-buttons fade-in">
          <button
            className="btn-get-started"
            onClick={() => navigate("/SignIn", { state: { flip: "signup" } })}
          >
            Get Started
          </button>
          <button
            className="btn-signin"
            onClick={() => navigate("/SignIn", { state: { flip: "login" } })}
          >
            Login
          </button>
        </section>

        <section className="home-steps fade-in">
          <h3>How It Works</h3>
          <ul>
            <li>
              <strong>1. Upload or Capture a Video</strong> : Using your webcam
              or a recorded file.
            </li>
            <li>
              <strong>2. Our AI Analyzes Your Expression</strong> : Detecting
              emotions through facial cues.
            </li>
            <li>
              <strong>3. Get a Report</strong> : Understand emotional trends and
              get feedback.
            </li>
          </ul>
        </section>

        <section className="home-benefits fade-in">
          <h3>Why Choose Bloom Well?</h3>
          <ul>
            <li>✅ Private, secure, and real-time analysis</li>
            <li>✅ Easy to use, no sign-in needed to start</li>
            <li>✅ Designed for awareness and mental wellness</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Home;
