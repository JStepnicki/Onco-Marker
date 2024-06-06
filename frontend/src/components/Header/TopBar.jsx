import React from 'react';
import { AppBar, Toolbar, Typography, Button, Pagination } from "@mui/material";

function TopBar({ patient, handleDialogOpen, page, setPage, totalItems }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {patient.name} {patient.surname} - Age: {patient.age} - Gender: {patient.sex ? "Male" : "Female"}
                </Typography>
                <Button color="inherit" onClick={handleDialogOpen}>
                    Add New Sample
                </Button>
                <Pagination
                    count={Math.ceil(totalItems / 6)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    sx={{ color: '#fff' }}
                />
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;