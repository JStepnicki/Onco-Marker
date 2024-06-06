import React from 'react';
import { Dialog, DialogContent, TextField, DialogActions, Button } from "@mui/material";

function SampleDialog({ open, handleClose, newSampleData, handleInputChange, handleAddSampleClick }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="organ_type"
                    label="Organ Type"
                    type="text"
                    fullWidth
                    value={newSampleData.organ_type}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="plasma_CA19_9"
                    label="Plasma CA19-9"
                    type="number"
                    fullWidth
                    value={newSampleData.plasma_CA19_9}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="creatinine"
                    label="Creatinine"
                    type="number"
                    fullWidth
                    value={newSampleData.creatinine}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="LYVE1"
                    label="LYVE1"
                    type="number"
                    fullWidth
                    value={newSampleData.LYVE1}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="REG1B"
                    label="REG1B"
                    type="number"
                    fullWidth
                    value={newSampleData.REG1B}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="TFF1"
                    label="TFF1"
                    type="number"
                    fullWidth
                    value={newSampleData.TFF1}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    name="REG1A"
                    label="REG1A"
                    type="number"
                    fullWidth
                    value={newSampleData.REG1A}
                    onChange={handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddSampleClick} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SampleDialog;