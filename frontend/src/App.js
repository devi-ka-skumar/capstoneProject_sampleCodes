import React from 'react';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import SignIn from './components/SignIn';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/signin" className="nav-link">Sign In</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;