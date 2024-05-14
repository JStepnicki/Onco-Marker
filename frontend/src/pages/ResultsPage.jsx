import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent } from "@mui/material";

function ResultsPage() {
  const location = useLocation();
  const sample = location.state.sample;


  let diagnosis = '';
  switch(sample.diagnosis) {
    case 1:
      diagnosis = 'Patient does not have cancer.';
      break;
    case 2:
      diagnosis = 'Patient probably has cancer.';
      break;
    case 3:
      diagnosis = 'Patient has cancer.';
      break;
    default:
      diagnosis = 'Invalid result.';
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Diagnosis Results</Typography>
        <Typography variant="body1">{diagnosis}</Typography>
        {sample.diagnosis > 1 && <Typography variant="body1">Stage: {sample.stage}</Typography>}
        <Typography variant="body2">Sample Information:</Typography>
        <Typography variant="body2">Stage: {sample.stage}</Typography>
        <Typography variant="body2">Benign Sample Diagnosis: {sample.benign_sample_diagnosis}</Typography>
        <Typography variant="body2">Markers: </Typography>
        {sample.markers_JSON && Object.entries(JSON.parse(sample.markers_JSON)).map(
          ([key, value]) => value && <Typography key={key} variant="body2">{`${key}: ${value}`}</Typography>
        )}
        <Typography variant="body2">Timestamp: {new Date(sample.timestamp).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
}

export default ResultsPage;