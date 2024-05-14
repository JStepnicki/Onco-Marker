import React, { useState } from 'react';
import { Button, TextField, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      navigate('/doctors');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle login errors
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email. Check your email address.');
      }

      alert('Password reset email sent. Check your inbox!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert(error.message || 'Failed to send reset email. Check your email address.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="login-form">
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Login
      </Button>
      <Box mt={2}>
        <Link onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
          Forgot Password?
        </Link>
      </Box>
    </Box>
  );
}

export default Login;
