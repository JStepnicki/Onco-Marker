import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PasswordResetConfirm.css';

function PasswordResetConfirm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [Token, setToken] = useState(searchParams.get('token') || '');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/password_reset/confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: Token, password: newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password. Please check the token and try again.');
            }

            alert('Password has been reset successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert(error.message || 'Failed to reset password. Please check the token and try again.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} className="password-reset-confirm-form">
            <TextField
                label="New Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                inputProps={{ style: { fontSize: 20 } }}
            />
            <TextField
                label="Confirm New Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                inputProps={{ style: { fontSize: 20 } }}
            />
            <TextField
                label="Reset Token"
                variant="outlined"
                fullWidth
                margin="normal"
                value={Token}
                onChange={(e) => setToken(e.target.value)}
                inputProps={{ style: { fontSize: 20 } }}
            />
            <Button variant="contained" type="submit" fullWidth>
                Reset Password
            </Button>
        </Box>
    );
}

export default PasswordResetConfirm;
