import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import app from '../../../firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Correct the import

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app); // Get auth from Firebase app

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password); // Use signInWithEmailAndPassword from auth
      navigate('/doctors');
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle login errors
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
    </Box>
  );
}

export default Login;
