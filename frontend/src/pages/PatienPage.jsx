import ResultsPage from './ResultsPage';
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSampleData, setNewSampleData] = useState({
    stage: "",
    benign_sample_diagnosis: "",
    plasma_CA19_9: "",
    creatinine: "",
    LYVE1: "",
    REG1B: "",
    TFF1: "",
    REG1A: "",
  });
  const location = useLocation();
  const patient = location.state.patient;

  const handleDeleteClick = async (sampleId) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }patients/cancer_samples/delete/${sampleId}/`,
      {
        method: "DELETE",
      }
    );
    setSamplesData(samplesData.filter((sample) => sample.id !== sampleId));
  };

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

  const handleKnnClick = async (sample) => {

    const markers = JSON.parse(sample.markers_JSON);

    const patientData = {
      age: patient.age, // assuming patient object has age and sex properties
      sex: patient.sex ? "M" : "F",
      stage: sample.stage,
      benign_sample_diagnosis: sample.benign_sample_diagnosis,
      ...markers,
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}classify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    const data = await response.json();

    console.log(data);
    sample.diagnosis = data[0];
    sample.stage = "II"
    console.log(sample);
  
    // Send a PUT request to the update endpoint
    const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}patients/cancer_samples/update/${sample.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sample),
    });
  
    if (!updateResponse.ok) {
      throw new Error('Failed to update sample');
    }
  
    // Update the samplesData array
    setSamplesData(samplesData.map(item => item.id === sample.id ? sample : item));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (event) => {
    setNewSampleData({
      ...newSampleData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSampleClick = async () => {
    const markers = {
      plasma_CA19_9: newSampleData.plasma_CA19_9,
      creatinine: newSampleData.creatinine,
      LYVE1: newSampleData.LYVE1,
      REG1B: newSampleData.REG1B,
      TFF1: newSampleData.TFF1,
      REG1A: newSampleData.REG1A,
    };

    const { plasma_CA19_9, creatinine, LYVE1, REG1B, TFF1, REG1A, ...rest } =
      newSampleData;

    const dataToSend = {
      ...rest,
      markers_JSON: JSON.stringify(markers),
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}patients/cancer_samples/add/${
        patient.id
      }/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      }
    );

    if (response.ok) {
      const new_sample = await response.json();
      setSamplesData([...samplesData, new_sample]);
    } else {
      console.error("Failed to add sample");
    }
    handleDialogClose();
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add New Sample
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Sample</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="benign_sample_diagnosis"
            label="Benign Sample Diagnosis"
            type="text"
            fullWidth
            value={newSampleData.benign_sample_diagnosis}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="plasma_CA19_9"
            label="Plasma CA19-9"
            type="number"
            fullWidth
            value={newSampleData.plasma_CA19_9}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="creatinine"
            label="Creatinine"
            type="number"
            fullWidth
            value={newSampleData.creatinine}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="LYVE1"
            label="LYVE1"
            type="number"
            fullWidth
            value={newSampleData.LYVE1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="REG1B"
            label="REG1B"
            type="number"
            fullWidth
            value={newSampleData.REG1B}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="TFF1"
            label="TFF1"
            type="number"
            fullWidth
            value={newSampleData.TFF1}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="REG1A"
            label="REG1A"
            type="number"
            fullWidth
            value={newSampleData.REG1A}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSampleClick} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
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
              <Typography variant="body-2">Diagnosis: {sample.diagnosi}</Typography>
              <Typography variant="body2">Stage: {sample.stage}</Typography>
              <Typography variant="body2">
                Benign Sample Diagnosis {sample.benign_sample_diagnosis}
              </Typography>
              <Typography variant="body2">
                Markers:{" "}
                {JSON.parse(sample.markers_JSON) &&
                  Object.entries(JSON.parse(sample.markers_JSON)).map(
                    ([key, value]) =>
                      value && <div key={key}>{`${key}: ${value}`}</div>
                  )}
              </Typography>
              <Typography variant="body2">
                Timestamp: {new Date(sample.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleKnnClick(sample)}
          >
            Generate KNN Output
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteClick(sample.id)}
          >
            Delete Sample
          </Button>
        </Sample>
      ))}
    </Container>
  );
}

export default PatientPage;
