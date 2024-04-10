import React, { useEffect, useState } from 'react';
import PatientList from '../components/PatientList/PatientList';
import './DoctorPage.css';


function DoctorPage() {

  return (
    <div className="doctor-page">
      <PatientList />
    </div>
  );
}

export default DoctorPage;
