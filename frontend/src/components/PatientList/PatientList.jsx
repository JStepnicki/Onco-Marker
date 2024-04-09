import React, { useState, useEffect } from 'react';
import mockPatients from '../../mockData';

function PatientList() {
  return (
    <div>
      <h2>Lista pacjentów</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Wiek</th>
            <th>Płeć</th>
          </tr>
        </thead>
        <tbody>
          {mockPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.surname}</td>
              <td>{patient.age}</td>
              <td>{patient.sex ? 'Mężczyzna' : 'Kobieta'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;