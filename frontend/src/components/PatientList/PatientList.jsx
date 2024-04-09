import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import mockPatients from '../../mockData';
import './PatientList.css';

function PatientList() {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {mockPatients.map(patient => (
            <TableRow key={patient.id} className="table-row">
              <TableCell className="table-cell">{patient.id}</TableCell>
              <TableCell className="table-cell">{patient.name}</TableCell>
              <TableCell className="table-cell">{patient.surname}</TableCell>
              <TableCell className="table-cell">{patient.age}</TableCell>
              <TableCell className="table-cell">{patient.sex ? 'Mężczyzna' : 'Kobieta'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default PatientList;
