import ResultsPage from "./ResultsPage";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
    benign_sample_diagnosis: "",
    plasma_CA19_9: "",
    creatinine: "",
    LYVE1: "",
    REG1B: "",
    TFF1: "",
    REG1A: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state.patient;

  const handleDeleteClick = async (sampleId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }patients/cancer_samples/delete/${sampleId}/`
      );
      setSamplesData(samplesData.filter((sample) => sample.id !== sampleId));
    } catch (error) {
      navigate("/error", {
        state: { status: error.response.status, message: error.message },
      });
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}patients/cancer_samples/${
            patient.id
          }/`
        );
        setSamplesData(response.data);
      } catch (error) {
        navigate("/error", {
          state: { status: error.response.status, message: error.message },
        });
      }
    };

    fetchPatientData();
  }, []);

  const handleKnnClick = async (sample) => {
    try {
      const markers = JSON.parse(sample.markers_JSON);
  
      const patientData = {
        age: patient.age,
        sex: patient.sex ? "M" : "F",
        stage: sample.stage,
        benign_sample_diagnosis: sample.benign_sample_diagnosis,
        ...markers,
      };
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}classify/`, patientData);
  
      const data = response.data;
  
      sample.diagnosis = data[0];
      sample.stage = data[0]
  
      const updateResponse = await axios.put(`${import.meta.env.VITE_API_URL}patients/cancer_samples/update/${sample.id}/`, sample);
  
      setSamplesData(samplesData.map(item => item.id === sample.id ? sample : item));
      navigate(`/patients/${patient.id}/results`, { state: { sample} });
    } catch (error) {
      navigate('/error', { state: { status: error.response.status, message: error.message } });
    }
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

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}patients/cancer_samples/add/${
          patient.id
        }/`,
        dataToSend
      );

      if (response.status === 201) {
        const new_sample = response.data;
        setSamplesData([...samplesData, new_sample]);
        handleDialogClose();
      } else {
            navigate("/error", {
          state: { status: error.response.status, message: error.message },
        });
      }
    } catch (error) {
      navigate("/error", {
        state: { status: error.response.status, message: error.message },
      });
    }
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
            name="organ_type"
            label="Organ Type"
            type="text"
            fullWidth
            value={newSampleData.organ_type}
            onChange={handleInputChange}
          />
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
              <Typography variant="body-2" style={{ display: "block" }}>
                Organ Type: {sample.organ_type}
              </Typography>
              <Typography variant="body-2" style={{ display: "block" }}>
                Diagnosis: {sample.diagnosis}
              </Typography>
              <Typography variant="body2" style={{ display: "block" }}>
                Stage: {sample.stage}
              </Typography>
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
