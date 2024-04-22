import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { styled } from "@mui/system";
import Filter from "../Header/Filter";
import { useNavigate } from 'react-router-dom';


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const memoizedSetSearch = useCallback((newSearch) => {
    setSearch(newSearch);
  }, []);

  const StyledBox = styled(Box)({
    flexGrow: 1,
    margin: '16px',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}patients/`
      );
      const data = await response.json();
      setPatients(data);
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const filteredPatients = patients.filter(patient =>
      patient.name.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayedPatients(filteredPatients.slice((page - 1) * 16, page * 16));
  }, [patients, page, search]);

  const handleExamineSamples = (patientId) => {
    const patient = patients.find(patient => patient.id === patientId);
    navigate(`/patients/${patientId}`, { state: { patient } });
  };

  return (
    <StyledBox>
      <Filter
        search={search}
        setSearch={memoizedSetSearch}
        page={page}
        setPage={setPage}
        totalItems={patients.length}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name and Surname</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Actions</TableCell> {/* Nowa kolumna dla guzika */}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell component="th" scope="row">
                  {patient.name} {patient.surname}
                </TableCell>
                <TableCell align="right">{patient.age}</TableCell>
                <TableCell align="right">{patient.sex == true ? 'Male' : 'Female'}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleExamineSamples(patient.id)}>
                    Examine samples
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {patients.length === 0 && <Typography>No patients found.</Typography>}
    </StyledBox>
  );
}

export default PatientList;
