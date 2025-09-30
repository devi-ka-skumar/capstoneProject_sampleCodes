import React from "react";
import backgroundImage from "../assets/background.jpg"; // Import the image
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImage})` }} // Use imported image here
      >
        <h1 className="main-heading">Bloom well</h1>
        <p className="tagline">
          When things change inside you, things change around you
        </p>
      </div>
    </div>
  );
};

export default Home;
