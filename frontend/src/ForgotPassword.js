import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:2000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset email sent');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleForgotPassword} disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
