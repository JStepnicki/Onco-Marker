import React, { useState } from 'react';
import { Button, TextField, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import app from '../../../firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/doctors');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle login errors
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your inbox!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send reset email. Check your email address.');
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
