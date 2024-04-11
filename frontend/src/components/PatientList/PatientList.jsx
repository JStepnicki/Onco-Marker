import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { styled } from "@mui/system";
import Filter from "../Header/Filter";


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const memoizedSetSearch = useCallback((newSearch) => {
    setSearch(newSearch);
  }, []);

  const StyledBox = styled(Box)({
    flexGrow: 1,
    margin: '16px',
  });

  const StyledGridItem = styled(Grid)(({ theme }) => ({
    height: '200px',
    width: '200px',
  }));

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
              <TableCell>Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell component="th" scope="row">
                  {patient.name}
                </TableCell>
                <TableCell align="right">{patient.age}</TableCell>
                <TableCell align="right">{patient.sex ? 'Man' : 'Female'}</TableCell>
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