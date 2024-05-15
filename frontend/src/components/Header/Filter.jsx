import React, { useState } from "react";
import {
  TextField,
  Pagination,
  Box,
  Paper,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const StyledPaper = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
});

const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledDialog = styled(Dialog)({
  "& .MuiDialogContent-root": {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
});

function Filter({ search, setSearch, page, setPage, totalItems, addPatient }) {
  const [newPatient, setNewPatient] = useState({
    name: "",
    surname: "",
    age: "",
    sex: "",
  });
  const [open, setOpen] = useState(false);

  const handleInputChange = (event) => {
    setNewPatient({
      ...newPatient,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await addPatient(newPatient);
    setNewPatient({ name: "", surname: "", age: "", sex: "" });
    setOpen(false);
  };

  return (
    <StyledPaper elevation={3}>
      <StyledBox>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Pagination
          count={Math.ceil(totalItems / 16)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
        <Button onClick={() => setOpen(true)}>Add Patient</Button>
      </StyledBox>
      <StyledDialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Patient</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={newPatient.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Surname"
              name="surname"
              value={newPatient.surname}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="email"
              label="email"
              value={newPatient.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Age"
              name="age"
              type="number"
              value={newPatient.age}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="sex-label">Sex</InputLabel>
              <Select
                labelId="sex-label"
                name="sex"
                value={newPatient.sex}
                onChange={handleInputChange}
              >
                <MenuItem value={true}>Male</MenuItem>
                <MenuItem value={false}>Female</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </StyledDialog>
    </StyledPaper>
  );
}

export default Filter;
