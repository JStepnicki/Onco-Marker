import DeleteIcon from '../Icons/Delete';
import EditIcon from '../Icons/Edit';
import ProfileIcon from '../Icons/Profile';
import ManIcon from '../Icons/Man.jsx';
import WomanIcon from '../Icons/Woman.jsx';
import React, {useState, useEffect, useCallback} from "react";
import {
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";
import {styled} from "@mui/system";
import Filter from "../Header/Filter";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import EditDialog from "./EditDialog";


const StyledBox = styled(Box)({
    flexGrow: 1,
    margin: "16px",
});

const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    color: '#555',
});

const StyledTableCellSort = styled(TableCell)({
    fontWeight: 'bold',
    color: '#555',
    '&:hover': {
        backgroundColor: '#f5f5f5', // Change this to the color you want on hover
        cursor: 'pointer',
    },
});

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [displayedPatients, setDisplayedPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [editPatient, setEditPatient] = useState(null);
    const [sortConfig, setSortConfig] = useState(null);

    const navigate = useNavigate();

    const memoizedSetSearch = useCallback((newSearch) => {
        setSearch(newSearch);
    }, []);
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}patients/`);
                setPatients(response.data);
            } catch (error) {
                navigate('/error', {state: {status: error.response.status, message: error.message}});
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        const filteredPatients = patients.filter((patient) =>
            (patient.name + ' ' + patient.surname).toLowerCase().includes(search.toLowerCase())
        );
        setDisplayedPatients(filteredPatients.slice((page - 1) * 7, page * 7));
    }, [patients, page, search]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        let sortedPatients = [...patients];
        if (sortConfig !== null) {
            sortedPatients.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        const filteredPatients = sortedPatients.filter((patient) =>
            (patient.name + ' ' + patient.surname).toLowerCase().includes(search.toLowerCase())
        );
        setDisplayedPatients(filteredPatients.slice((page - 1) * 7, page * 7));
    }, [patients, page, search, sortConfig]);


    const handleExamineSamples = (patientId) => {
        const patient = patients.find((patient) => patient.id === patientId);
        navigate(`/patients/${patientId}`, {state: {patient}});
    };

    const addPatient = async (patientData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}patients/add/`,
                patientData
            );
            setPatients([...patients, response.data]);
        } catch (error) {
            navigate('/error', {state: {status: error.response.status, message: "Internal Server Error."}});
        }
    };

    const deletePatient = async (patientId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}patients/${patientId}/delete/`);
            setPatients(patients.filter((patient) => patient.id !== patientId));
        } catch (error) {
            navigate('/error', {state: {status: error.response.status, message: error.message}});
        }
    };

    const updatePatient = async (patientId, updatedData) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}patients/${patientId}/update/`,
                updatedData
            );
            if (response.status === 200) {
                setPatients(
                    patients.map((patient) =>
                        patient.id === patientId ? response.data : patient
                    )
                );
            } else {
                console.error(`Failed to update patient: ${response.status}`);
            }
        } catch (error) {
            navigate('/error', {state: {status: error.response.status, message: error.message}});
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = (patient) => {
        setEditPatient(patient);
        setOpen(true);
    };

    return (
        <StyledBox>
            <Filter
                search={search}
                setSearch={memoizedSetSearch}
                page={page}
                setPage={setPage}
                totalItems={patients.length}
                addPatient={addPatient}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCellSort align="center" onClick={() => requestSort('sex')}>Gender</StyledTableCellSort>
                            <StyledTableCellSort align="center" onClick={() => requestSort('name')}>Name and Surname</StyledTableCellSort>
                            <StyledTableCellSort align="center" onClick={() => requestSort('email')}>Email</StyledTableCellSort>
                            <StyledTableCellSort align="center" onClick={() => requestSort('age')}>Age</StyledTableCellSort>
                            <StyledTableCellSort align="center">Actions</StyledTableCellSort>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedPatients.map((patient) => (
                            <TableRow key={patient.id}>
                                <StyledTableCell align="center">{patient.sex === true ? <ManIcon/> : <WomanIcon/>}</StyledTableCell>
                                <StyledTableCell align="center">{patient.name} {patient.surname}</StyledTableCell>
                                <StyledTableCell align="center">{patient.email}</StyledTableCell>
                                <StyledTableCell align="center">{patient.age}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <ProfileIcon style={{ marginRight: '10px' }} onClick={() => handleExamineSamples(patient.id)}/>
                                    <EditIcon style={{ marginRight: '10px' }} onClick={() => handleOpen(patient)}/>
                                    <DeleteIcon onClick={() => deletePatient(patient.id)}/>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <EditDialog
                open={open}
                handleClose={handleClose}
                patient={editPatient}
                updatePatient={updatePatient}
            />
        </StyledBox>
    );
}

export default PatientList;