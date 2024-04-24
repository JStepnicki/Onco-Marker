import React, { useState } from 'react';
import { Button, TextField, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import app from '../../../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Dodaj import Firebase Auth

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app); // Pobierz auth z Firebase app

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" className="register-container">
      <Box component="form" onSubmit={handleSubmit} className="register-form">
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
          Submit
        </Button>
      </Box>
    </Grid>
  );
}

export default Register;
