import React from 'react';
import { Button, TextField, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import app from './firebase';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/doctors');
  };

  return (
      <Box component="form" onSubmit={handleSubmit} className="login-form">
        <TextField label="Username" variant="outlined" fullWidth margin="normal" />
        <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </Box>
  );
}

export default Login;