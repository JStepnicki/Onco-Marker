import React, {useState} from 'react';
import {Button, TextField, Box, Link} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const theme = createTheme({
        components: {
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        '&:hover': {
                            color: '#333',
                        },
                        '&.Mui-focused': {
                            color: '#333',
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333',
                            borderWidth: '2px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#000',
                            borderWidth: '3px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#333',
                            borderWidth: '2px',
                        },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        '&::placeholder': {
                            color: '#333',
                        },
                        '&:focus::placeholder': {
                            color: '#333',
                        },
                    },
                },
            },
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
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
                body: JSON.stringify({username}),
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
        <ThemeProvider theme={theme}>
            <Box component="form" onSubmit={handleSubmit} className="login-form">
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    inputProps={{style: {fontSize: 20}}}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{style: {fontSize: 20}}}
                />
                <Button variant="contained" type="submit" fullWidth>
                    Login
                </Button>
                <Link onClick={handleForgotPassword} underline="hover">
                    Forgot Password?
                </Link>
            </Box>
        </ThemeProvider>
    );
}

export default Login;
