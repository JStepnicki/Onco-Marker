import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";

function EditDialog({ open, handleClose, patient, updatePatient }) {
  const [editForm, setEditForm] = useState({ name: "", surname: "", age: "", sex: "" });

  useEffect(() => {
    setEditForm(patient);
  }, [patient]);

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updatePatient(patient.id, editForm);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Patient</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={editForm?.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="surname"
          label="Surname"
          value={editForm?.surname}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="age"
          label="Age"
          type="number"
          value={editForm?.age}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="sex-label">Sex</InputLabel>
          <Select
            labelId="sex-label"
            name="sex"
            value={editForm?.sex}
            onChange={handleInputChange}
          >
            <MenuItem value={true}>Male</MenuItem>
            <MenuItem value={false}>Female</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;