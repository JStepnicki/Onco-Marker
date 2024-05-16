import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Card, CardContent } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState([]);
  const [sample, setSample] = useState({});

  useEffect(() => {
    if (location.state?.sample) {
      setSample(location.state.sample);
    } else {
      console.log("No sample data found in location state");
      const urlParts = window.location.pathname.split("/");
      const accessToken = urlParts[urlParts.length - 1];
      const sampleId = urlParts[urlParts.length - 2];
      const fetchPatient = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}patients/`,
            {
              params: {
                access_token: accessToken,
              },
            }
          );

          if (response.data.length === 0) {
            navigate("/error", {
              state: { status: 404, message: "Patient not found" },
            });
          } else {
            setPatient(response.data);
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}cancer_samples/`,
                {
                  params: {
                    sample_id: sampleId,
                  },
                }
              );
              setSample(response.data);
            } catch (error) {
              navigate("/error", {
                state: {
                  status: error.response?.status || 500,
                  message: error.message,
                },
              });
            }
          }
        } catch (error) {
          navigate("/error", {
            state: {
              status: error.response?.status || 500,
              message: error.message,
            },
          });
        }
      };

      fetchPatient();
    }
  }, []); 

  console.log(sample);
  let diagnosis = "";
  switch (sample.diagnosis) {
    case "1":
      diagnosis = "Patient does not have cancer.";
      break;
    case "2":
      diagnosis = "Patient probably has cancer.";
      break;
    case "3":
      diagnosis = "Patient has cancer.";
      break;
    default:
      diagnosis = "Invalid result.";
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Diagnosis Results</Typography>
        <Typography variant="body1">{diagnosis}</Typography>
        {sample.diagnosis > 1 && (
          <Typography variant="body1">Stage: {sample.stage}</Typography>
        )}
        <Typography variant="body2">Sample Information:</Typography>
        <Typography variant="body2">
          Benign Sample Diagnosis: {sample.benign_sample_diagnosis}
        </Typography>
        <Typography variant="body2">Markers: </Typography>
        {sample.markers_JSON &&
          Object.entries(JSON.parse(sample.markers_JSON)).map(
            ([key, value]) =>
              value && (
                <Typography
                  key={key}
                  variant="body2"
                >{`${key}: ${value}`}</Typography>
              )
          )}
        <Typography variant="body2">
          Timestamp: {new Date(sample.timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ResultsPage;
