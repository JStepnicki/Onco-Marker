import React from 'react';
import PatientList from '../components/PatientList/PatientList';
import './DoctorPage.css';

function DoctorPage() {
  return (
    <div className="doctor-page">
      <h1>Hello from Doctor Page</h1>
      <PatientList />
    </div>
  );
}

export default DoctorPage;
