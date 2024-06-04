import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import Login from '../components/Auth/Login';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();


  const handleRegister = (event) => {
    event.preventDefault();
    navigate('/register');
  };

  return (
    <div className="main-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Log in
      </Typography>
      <Login />
      <Typography variant="subtitle2">
        Don't have an account?{' '}
        <Link href="#" onClick={handleRegister} underline="hover">
          Register
        </Link>
      </Typography>
    </div>
  );
}

export default MainPage;