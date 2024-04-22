import React from 'react';
import { Button, TextField, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/doctors');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" className="register-container">
      <Box component="form" onSubmit={handleSubmit} className="register-form">
        <TextField label="Username" variant="outlined" fullWidth margin="normal" />
        <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Submit
        </Button>
      </Box>
    </Grid>
  );
}

export default Register;