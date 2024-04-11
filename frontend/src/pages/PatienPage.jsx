import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Card, CardContent, Grid, Paper, Box } from "@mui/material";
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

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box textAlign="center">
              <Typography variant="h6">{patient.name} {patient.surname}</Typography>
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
