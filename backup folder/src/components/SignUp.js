import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import "../styles/SignUp.css";
import backgroundImage from "../assets/bg.jpeg";

function SignUp() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSignUp, setIsSignUp] = useState(
        location.state?.flip !== "login"
    );
    const [message, setMessage] = useState("");         // For message text
    const [messageType, setMessageType] = useState(""); // "success" or "error"


    return (
        <div
            className="signup-container"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
            }}
        >
            <div className="toggle-wrapper">
        <span
            onClick={() => setIsSignUp(false)}
            className={!isSignUp ? "active" : ""}
        >
          Log in
        </span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={isSignUp}
                        onChange={() => setIsSignUp(!isSignUp)}
                    />
                    <span className="slider"/>
                </label>
                <span
                    onClick={() => setIsSignUp(true)}
                    className={isSignUp ? "active" : ""}
                >
          Sign up
        </span>
            </div>

            <div className={`flip-card ${isSignUp ? "flipped" : ""}`}>
                <div className="flip-card-inner">
                    {/* Log in */}
                    <div className="flip-card-front">
                        <h2>Log in</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                navigate("/Dashboard");
                            }}
                        >
                            <input type="email" placeholder="Email"/>
                            <input type="password" placeholder="Password"/>
                            <button type="submit">Let’s go!</button>
                        </form>
                    </div>

                    {/* Sign up */}
                    <div className="flip-card-back">
                        <h2>Sign up</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                navigate("/Dashboard");
                            }}
                        >
                            <input type="text" placeholder="First Name"/>
                            <input type="text" placeholder="Last Name"/>
                            <input type="email" placeholder="Email"/>
                            <input type="password" placeholder="Password"/>
                            <input type="password" placeholder="Confirm Password"/>
                            <button type="submit">Confirm!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
