import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel, styled,
} from "@mui/material";
import {useState, useEffect} from "react";
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    '&:hover': {
                        color: '#333',
                    },
                    '&.Mui-focused': {
                        color: '#333',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                        borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000',
                        borderWidth: '3px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    '&::placeholder': {
                        color: '#333',
                    },
                    '&:focus::placeholder': {
                        color: '#333',
                    },
                },
            },
        },
    },
});

const StyledDialog = styled(Dialog)({
    "& .MuiDialogContent-root": {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
});

function EditDialog({open, handleClose, patient, updatePatient}) {
    const [editForm, setEditForm] = useState({
        name: "",
        surname: "",
        age: "",
        sex: "",
    });

    useEffect(() => {
        setEditForm(patient);
    }, [patient]);

    const handleInputChange = (e) => {
        setEditForm({...editForm, [e.target.name]: e.target.value});
    };

    const handleUpdate = () => {
        updatePatient(patient.id, editForm);
        handleClose();
    };

    return (
        <ThemeProvider theme={theme}>
            <StyledDialog open={open} onClose={handleClose} id={'edit-dialog'}>
                <DialogContent>
                    <TextField
                        id={'name'}
                        name="name"
                        label="Name"
                        value={editForm?.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        id={'surname'}
                        name="surname"
                        label="Surname"
                        value={editForm?.surname}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        id={'email'}
                        name="email"
                        label="Email"
                        value={editForm?.email}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        id={'age'}
                        name="age"
                        label="Age"
                        type="number"
                        value={editForm?.age}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="sex-label">Sex</InputLabel>
                        <Select
                            id={'sex'}
                            labelId="sex-label"
                            name="sex"
                            value={editForm?.sex}
                            onChange={handleInputChange}
                        >
                            <MenuItem value={true}>Male</MenuItem>
                            <MenuItem value={false}>Female</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        id={'cancel-button'}
                        sx={{
                            backgroundColor: '#333',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#555',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        id={'update-button'}
                        sx={{
                            backgroundColor: '#333',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#555',
                                cursor: 'pointer'
                            }
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </StyledDialog>
        </ThemeProvider>
    );
}

export default EditDialog;
