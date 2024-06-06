import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import TopBar from "../components/Header/TopBar.jsx";
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
    Pagination,
    AppBar,
    Toolbar,
} from "@mui/material";
import SampleDialog from "../components/Sample/SampleDialog.jsx";
import {styled} from "@mui/system";

// const Container = styled("div")({
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "20px",
// });

const StyledBox = styled(Box)({
    flexGrow: 1,
    margin: "16px",
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
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [newSampleData, setNewSampleData] = useState({
        organ_type: "", // Dodaj pole organ_type
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
                state: {status: error.response.status, message: error.message},
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
                    state: {status: error.response.status, message: error.message},
                });
            }
        };

        fetchPatientData();
    }, []);

    const handleKnnClick = async (sample) => {
        try {
            let markers;
            if (typeof sample.markers_JSON === 'string') {
                try {
                    markers = JSON.parse(sample.markers_JSON);
                } catch (parseError) {
                    throw new Error(`Invalid JSON format in markers_JSON: ${parseError.message}`);
                }
            } else if (typeof sample.markers_JSON === 'object') {
                markers = sample.markers_JSON;
            } else {
                throw new Error('markers_JSON is not a valid JSON format or object');
            }

            const classificationData = {
                ...markers,
                organ_type: sample.organ_type,
                sample_id: sample.id,
                patient_id: patient.id,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}classify/`,
                classificationData
            );

            const data = response.data;
            sample.diagnosis = data[0];
            sample.stage = data[0];


            setSamplesData(
                samplesData.map((item) => (item.id === sample.id ? sample : item))
            );

            navigate(`/patients/${patient.id}/results`, {state: {sample}});
        } catch (error) {
            console.error("Error:", error); // Log the full error for debugging
            const status = error.response ? error.response.status : 500;
            const message = error.message ? error.message : 'Something went wrong';
            navigate("/error", {
                state: {status, message},
            });
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

        const {plasma_CA19_9, creatinine, LYVE1, REG1B, TFF1, REG1A, ...rest} =
            newSampleData;

        const dataToSend = {
            ...rest,
            markers_JSON: markers,
            organ_type: newSampleData.organ_type, // Dodaj pole organ_type
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
                    state: {status: error.response.status, message: error.message},
                });
            }
        } catch (error) {
            navigate("/error", {
                state: {status: error.response.status, message: error.message},
            });
        }
    };

    return (
        <StyledBox>
            <TopBar
                patient={patient}
                handleDialogOpen={handleDialogOpen}
                page={page}
                setPage={setPage}
                totalItems={samplesData.length}
            />
            <SampleDialog
                open={dialogOpen}
                handleClose={handleDialogClose}
                newSampleData={newSampleData}
                handleInputChange={handleInputChange}
                handleAddSampleClick={handleAddSampleClick}
            />
            <Grid container spacing={2}>
                {samplesData
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((sample) => (
                        <Grid item xs={12} sm={6} md={4} key={sample.id}>
                            <Sample>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body-2">Sample ID: {sample.id}</Typography>
                                        <Typography variant="body2">
                                            Stage: {sample.stage}
                                        </Typography>
                                        <Typography variant="body2">
                                            {sample.markers_JSON && (
                                                <>
                                                    Markers:{" "}
                                                    {Object.entries(
                                                        typeof sample.markers_JSON === "string"
                                                            ? JSON.parse(sample.markers_JSON)
                                                            : sample.markers_JSON
                                                    ).map(([key, value]) => (
                                                        <div key={key}>{`${key}: ${value}`}</div>
                                                    ))}
                                                </>
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
                        </Grid>
                    ))}
            </Grid>
        </StyledBox>
    );
}

export default PatientPage;
