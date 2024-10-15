// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Import the CSS file

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');

    try {
      const response = await fetch('http://localhost:2000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, id, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successfully');
        navigate('/login');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;