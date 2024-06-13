import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Typography, Card, CardContent, Box, Container, Grid, CardHeader} from "@mui/material";
import {useState, useEffect} from "react";
import axios from "axios";
import PancreasIcon from "../components/Icons/Pancreas.jsx";
import LiverIcon from "../components/Icons/Liver.jsx";
import BreastIcon from "../components/Icons/Breast.jsx";
import ProstateIcon from "../components/Icons/Prostate.jsx";
import LeukemiaIcon from "../components/Icons/Leukemia.jsx";

function ResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [patient, setPatient] = useState([]);
    const [sample, setSample] = useState({});

    const organIcons = {
        pancreas: <PancreasIcon />,
        liver: <LiverIcon />,
        breast: <BreastIcon />,
        prostate: <ProstateIcon />,
        leukemia: <LeukemiaIcon />,
    };

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
                    console.log(response.data)

                    if (response.data.length === 0) {
                        navigate("/error", {
                            state: {status: 404, message: "Patient not found"},
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
        <Container maxWidth="md">
            <Box my={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Diagnosis Results</Typography>
                                <Typography variant="body1">{diagnosis}</Typography>
                                {sample.diagnosis > 1 && (
                                    <Typography variant="body1">Stage: {sample.stage}</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card sx={{ marginBottom: '4px', height: '100%' }}>
                            <CardHeader
                                title={`Organ: ${sample.organ_type}`}
                                subheader={
                                    <>
                                        <Typography variant="body2">{`Sample ID: ${sample.id}`}</Typography>
                                        <Typography variant="body2">{`Timestamp: ${new Date(sample.timestamp).toLocaleString()}`}</Typography>
                                    </>
                                }
                                action={
                                    <Box sx={{ position: 'relative', top: 8, right: 8 }}>
                                        {organIcons[sample.organ_type]}
                                    </Box>
                                }
                                sx={{ backgroundColor: '#f5f5f5', padding: '8px' }}
                            />
                            <CardContent sx={{ padding: '16px' }}>
                                {sample.markers_JSON &&
                                    Object.entries(sample.markers_JSON).map(
                                        ([key, value]) =>
                                            value && (
                                                <Typography
                                                    key={key}
                                                    variant="body2"
                                                >{`${key}: ${value}`}</Typography>
                                            )
                                    )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ResultsPage;