import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import ContactUS from "./components/ContactUs";
import About from "./components/AboutUs";
import Dashboard from "./components/Dashboard";

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { Home as HomeIcon, Info, Login } from "@mui/icons-material";
import "./App.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate(); // for navigation

  return (
    <div className="app-container">
      {/* Material UI Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "white", boxShadow: "none" }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => navigate("/Home")}
                variant="contained"
                color="inherit"
                startIcon={<HomeIcon />}
                sx={{
                  color: "#537955",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#e95d4d",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Home
              </Button>
              <Button
                onClick={() => navigate("/SignIn")}
                variant="contained"
                color="inherit"
                startIcon={<Login />}
                sx={{
                  color: "#537955",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#e95d4d",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/ContactUs")}
                variant="contained"
                sx={{
                  color: "#537955",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#e95d4d",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Contact Us
              </Button>
              <Button
                onClick={() => navigate("/AboutUs")}
                variant="contained"
                onMouseEnter={() => setShowAbout(true)}
                onMouseLeave={() => setShowAbout(false)}
                color="inherit"
                startIcon={<Info />}
                sx={{
                  color: "#537955",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#e95d4d",
                    backgroundColor: "transparent",
                  },
                }}
              >
                About Us
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      {showAbout && (
        <Box
          onMouseEnter={() => setShowAbout(true)}
          onMouseLeave={() => setShowAbout(false)}
          sx={{
            position: "absolute",
            top: "100px",
            left: 0,
            width: "280px",
            backgroundColor: "#e95d4d",
            borderRight: "4px solid #e95d4d",
            padding: "1rem 1.2rem",
            boxShadow: "4px 0 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#ffff", fontWeight: "bold", fontFamily: "Pacifico" }}
          >
            Our Vision
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#ffff" }}>
            To leverage AI for early detection of emotional and mental disorders
            to create healthier societies.
          </Typography>

          <Typography
            variant="h6"
            sx={{ mt: 2, color: "#ffff", fontWeight: "bold" }}
          >
            Our Mission
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#ffff" }}>
            We aim to empower individuals through awareness and access to
            cutting-edge emotion analysis tools built on deep learning.
          </Typography>
        </Box>
      )}

      <Container sx={{ mt: 12, textAlign: "center" }}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="content-container">
                <h1 className="title">Bloom Well</h1>
                <h4 className="tagline">
                  "When things change inside you, things change around you"
                </h4>
                <img
                  src="/background.jpg"
                  alt="Mind Blooming"
                  className="bg-image"
                />
              </div>
            }
          />
            <Route path="/Home" element={<Home/>}/>
            <Route path="/SignIn" element={<SignUp/>}/>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/ContactUs" element={<ContactUS/>}/>
            <Route path="/AboutUs" element={<About/>}/>
        </Routes>
      </Container>
    </div>
  );
}

export default App;
