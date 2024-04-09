import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/doctors');
  };

  return (
    <div>
      <h1>Welcome to our application</h1>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
}

export default MainPage;