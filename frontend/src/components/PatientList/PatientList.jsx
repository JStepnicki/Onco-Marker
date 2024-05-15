import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import Filter from "../Header/Filter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditDialog from "./EditDialog";

const StyledBox = styled(Box)({
  flexGrow: 1,
  margin: "16px",
});

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editPatient, setEditPatient] = useState(null);

  const navigate = useNavigate();

  const memoizedSetSearch = useCallback((newSearch) => {
    setSearch(newSearch);
  }, []);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}patients/`);
        setPatients(response.data);
      } catch (error) {
        navigate('/error', { state: { status: error.response.status, message: error.message } });
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filteredPatients = patients.filter((patient) =>
      (patient.name + ' ' + patient.surname).toLowerCase().includes(search.toLowerCase())
    );
    setDisplayedPatients(filteredPatients.slice((page - 1) * 16, page * 16));
  }, [patients, page, search]);

  const handleExamineSamples = (patientId) => {
    const patient = patients.find((patient) => patient.id === patientId);
    navigate(`/patients/${patientId}`, { state: { patient } });
  };

  const addPatient = async (patientData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}patients/add/`,
        patientData
      );
      setPatients([...patients, response.data]);
    } catch (error) {
      navigate('/error', { state: { status: error.response.status, message: "Internal Server Error."} });
    }
  };

  const deletePatient = async (patientId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}patients/${patientId}/delete/`);
      setPatients(patients.filter((patient) => patient.id !== patientId));
    } catch (error) {
      navigate('/error', { state: { status: error.response.status, message: error.message } });
    }
  };

  const updatePatient = async (patientId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}patients/${patientId}/update/`,
        updatedData
      );
      if (response.status === 200) {
        setPatients(
          patients.map((patient) =>
            patient.id === patientId ? response.data : patient
          )
        );
      } else {
        console.error(`Failed to update patient: ${response.status}`);
      }
    } catch (error) {
      navigate('/error', { state: { status: error.response.status, message: error.message } });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (patient) => {
    setEditPatient(patient);
    setOpen(true);
  };

  return (
    <StyledBox>
      <Filter
        search={search}
        setSearch={memoizedSetSearch}
        page={page}
        setPage={setPage}
        totalItems={patients.length}
        addPatient={addPatient}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name and Surname</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name} {patient.surname}</TableCell>
                <TableCell align="right">{patient.email}</TableCell>
                <TableCell align="right">{patient.age}</TableCell>
                <TableCell align="right">{patient.sex == true ? 'Male' : 'Female'}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleExamineSamples(patient.id)}>
                    Examine
                  </Button>
                  <Button onClick={() => handleOpen(patient)}>Edit</Button>
                  <Button onClick={() => deletePatient(patient.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditDialog
        open={open}
        handleClose={handleClose}
        patient={editPatient}
        updatePatient={updatePatient}
      />
    </StyledBox>
  );
}

export default PatientList;