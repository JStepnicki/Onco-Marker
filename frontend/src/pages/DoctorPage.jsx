import React, { useEffect, useState } from 'react';
import PatientList from '../components/PatientList/PatientList';


function DoctorPage() {
    const username = sessionStorage.getItem('username');
    if (!username) {
        alert('You must be logged in to view this page');
        window.location.href = '/';
        return null;
    }
  return (
    <div className="doctor-page">
      <PatientList />
    </div>
  );
}

export default DoctorPage;
