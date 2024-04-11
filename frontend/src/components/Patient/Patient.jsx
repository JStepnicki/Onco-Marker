import React from 'react';
import { useParams } from 'react-router-dom';
import mockPatients from "../../mockData.js"; // importujemy hook useParams

function PatientDetail() {
  const { id } = useParams(); // pobieramy id pacjenta z parametrów URL
  const patient = mockPatients.find(patient => patient.id === id); // znajdujemy pacjenta o danym id

  if (!patient) {
    return <p>Pacjent nie został znaleziony</p>;
  }

  return (
    <div>
      <h1>Szczegóły pacjenta: {patient.name} {patient.surname}</h1>
      <h2>Próbki raków:</h2>
      {patient.cancer_samples.map(sample => (
        <div key={sample.id}>
          <h3>{sample.organ_type}</h3>
          <p>Kohorta pacjenta: {sample.patient_cohort}</p>
          <p>Pochodzenie próbki: {sample.sample_origin}</p>
          <p>Markery: {sample.markers_JSON}</p>
        </div>
      ))}
    </div>
  );
}

export default PatientDetail;
