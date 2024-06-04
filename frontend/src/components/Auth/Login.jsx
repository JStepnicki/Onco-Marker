import React, { useState } from 'react';
import { Button, TextField, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
      sessionStorage.setItem('username', username);
      navigate('/doctors');
    } catch (error) {
      console.error('Error signing in:', error);
        alert(error.message || 'Failed to sign in. Check your username and password.');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
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
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
