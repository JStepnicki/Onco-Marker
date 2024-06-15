import React, { useState } from 'react';
import { Typography, Link } from '@mui/material';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import './MainPage.css';

function MainPage() {
    const [isRegister, setIsRegister] = useState(false);

    const handleRegister = (event) => {
        event.preventDefault();
        setIsRegister(true);
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setIsRegister(false);
    };

    return (
        <div className="main-page">
            <div className="form-container">
                {isRegister ? <Register/> : <Login/>}
                <Typography variant="subtitle2">
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <Link href="#" onClick={isRegister ? handleLogin : handleRegister} underline="hover">
                        {isRegister ? 'Log in' : 'Register'}
                    </Link>
                </Typography>
            </div>
        </div>
    );
}

export default MainPage;