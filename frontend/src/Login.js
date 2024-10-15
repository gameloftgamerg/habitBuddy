// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // You can create a CSS file to style the login page.

const Login = ({ setToken, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:2000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Match with your backend
    });

    const data = await response.json();
    
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate("/"); // Redirect to the main page
    } else {
      setError(data.error || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Habit Tracker</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
      <div className="login-footer">
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <p>
          <a href="/forgot-password">Forgot password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

