import React, {useState} from 'react';
import {Button, TextField, Box, Grid} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import './Register.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
   const [confirmPassword, setConfirmPassword] = useState('');
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

                if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password}),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            setError(error.message);
        }
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            sessionStorage.setItem('email', email);
            navigate('/doctors');
        } catch (error) {
            console.error('Error signing in:', error);
            alert(error.message || 'Failed to sign in. Check your username and password.');
        }
    };

     return (
        <ThemeProvider theme={theme}>
            <Grid container justifyContent="center" alignItems="center" className="register-container">
                <Box component="form" onSubmit={handleSubmit} className="register-form">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        inputProps={{ style: { fontSize: 20 } }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputProps={{ style: { fontSize: 20 } }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{ style: { fontSize: 20 } }}
                    />
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        inputProps={{ style: { fontSize: 20 } }}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Register
                    </Button>
                </Box>
            </Grid>
        </ThemeProvider>
    );
}

export default Register;
