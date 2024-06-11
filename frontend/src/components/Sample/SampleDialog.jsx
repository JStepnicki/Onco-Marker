import React, { useState } from 'react';
import { Dialog, DialogContent, TextField, DialogActions, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
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

const organMarkers = {
    pancreas: ["plasma_CA19_9", "creatinine", "LYVE1", "REG1B", "TFF1", "REG1A"],
    liver: ["cv_19", "afp"],
    // Add other organs and their markers here
};

function SampleDialog({ open, handleClose, newSampleData, handleInputChange, handleAddSampleClick }) {
    const [selectedOrgan, setSelectedOrgan] = useState("");

    const handleOrganChange = (event) => {
        setSelectedOrgan(event.target.value);
        handleInputChange(event); // Update newSampleData with organ_type
    };

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Organ Type</InputLabel>
                        <Select
                            value={newSampleData.organ_type}
                            onChange={handleOrganChange}
                            name="organ_type"
                        >
                            {Object.keys(organMarkers).map((organ) => (
                                <MenuItem key={organ} value={organ}>
                                    {organ}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedOrgan && organMarkers[selectedOrgan].map((marker) => (
                        <TextField
                            key={marker}
                            margin="dense"
                            name={marker}
                            label={marker.replace("_", " ")}
                            type="number"
                            fullWidth
                            value={newSampleData[marker] || ""}
                            onChange={handleInputChange}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        sx={{
                            backgroundColor: '#333',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#555',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddSampleClick}
                        type="submit"
                        sx={{
                            backgroundColor: '#333',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#555',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default SampleDialog;
