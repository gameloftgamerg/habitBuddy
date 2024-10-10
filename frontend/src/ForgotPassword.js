import React, { useState } from 'react';
import './ForgotPassword.css'; // Updated for new styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://your-api-url/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage('A password reset link has been sent to your email.');
      setError('');
      setEmail('');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="animated-input"
          />
          <label>Email:</label>
        </div>
        <button type="submit" className="submit-button">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
