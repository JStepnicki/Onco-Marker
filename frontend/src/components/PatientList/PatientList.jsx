import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import mockPatients from "../../mockData";
import "./PatientList.css";

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}patients/`);
      const data = await response.json();
      setPatients(data);
    };

    fetchPatients();
  }, []);

  return (
    <Paper className="paper-container">
      <Table className="table-container">
        <TableHead>
          <TableRow>
            <TableCell className="table-head-cell">ID</TableCell>
            <TableCell className="table-head-cell">Imię</TableCell>
            <TableCell className="table-head-cell">Nazwisko</TableCell>
            <TableCell className="table-head-cell">Wiek</TableCell>
            <TableCell className="table-head-cell">Płeć</TableCell>
            <TableCell className="table-head-cell"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockPatients.map((patient) => (
            <TableRow key={patient.id} className="table-row">
              <TableCell className="table-cell">{patient.id}</TableCell>
              <TableCell className="table-cell">{patient.name}</TableCell>
              <TableCell className="table-cell">{patient.surname}</TableCell>
              <TableCell className="table-cell">{patient.age}</TableCell>
              <TableCell className="table-cell">
                {patient.sex ? "Mężczyzna" : "Kobieta"}
              </TableCell>
              <TableCell className="table-cell">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSelect(patient.id)}
                >
                  Wybierz
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default PatientList;
