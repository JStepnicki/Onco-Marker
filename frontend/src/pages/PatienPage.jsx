import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Card, CardContent, Grid, Paper, Box, Button } from "@mui/material";
import { styled } from "@mui/system";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
});

const Sample = styled("div")({
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  width: "50%",
});

function PatientPage() {
  const [samplesData, setSamplesData] = useState([]);
  const location = useLocation();
  const patient = location.state.patient;

  useEffect(() => {
    const fetchPatientData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}patients/cancer_samples/${patient.id}/`
      );
      const data = await response.json();
      setSamplesData(data);
    };

    fetchPatientData();
  }, []);

  const handleKnnClick = async () => {
    const new_sample_data = {
      age: 45,
      sex: "Male",
      stage: "Stage II",
      benign_sample_diagnosis: "Benign",
      plasma_CA19_9: 37.0,
      creatinine: 0.9,
      LYVE1: 1.2,
      REG1B: 0.8,
      TFF1: 1.1,
      REG1A: 0.7,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}classify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_sample_data),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleKnnClick}>
        Run KNN Classification
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box textAlign="center">
              <Typography variant="h6">
                {patient.name} {patient.surname}
              </Typography>
              <Typography variant="body1">Age: {patient.age}</Typography>
              <Typography variant="body1">
                Gender: {patient.sex == true ? "Male" : "Female"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {samplesData.map((sample) => (
        <Sample key={sample.id}>
          <Card>
            <CardContent>
              <Typography variant="body2">
                Sample Organ Type: {sample.organ_type}
              </Typography>
              <Typography variant="body2">
                Sample Patient Cohort: {sample.patient_cohort}
              </Typography>
              <Typography variant="body2">
                Sample Origin: {sample.sample_origin}
              </Typography>
              <Typography variant="body2">
                Sample Markers: {sample.markers_JSON}
              </Typography>
            </CardContent>
          </Card>
        </Sample>
      ))}
    </Container>
  );
}

export default PatientPage;
