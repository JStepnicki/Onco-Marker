import React, {useState} from "react";
import {
    TextField,
    Pagination,
    Box,
    Paper,
    styled,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from "@mui/material";
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

const StyledPaper = styled(Paper)({
    padding: "16px",
    marginBottom: "16px",
});

const StyledBox = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

const StyledDialog = styled(Dialog)({
    "& .MuiDialogContent-root": {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
});

function Filter({search, setSearch, page, setPage, totalItems, addPatient}) {
    const [newPatient, setNewPatient] = useState({
        name: "",
        surname: "",
        age: "",
        sex: "",
    });
    const [open, setOpen] = useState(false);

    const handleInputChange = (event) => {
        setNewPatient({
            ...newPatient,
            [event.target.name]: event.target.value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await addPatient(newPatient);
        setNewPatient({name: "", surname: "", age: "", sex: ""});
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <StyledPaper elevation={3}>
                <StyledBox>
                    <TextField
                        label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Pagination
                        count={Math.ceil(totalItems / 6)}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#fff',
                                backgroundColor: '#999',
                                '&:hover': {
                                    backgroundColor: '#555',
                                    cursor: 'pointer'
                                }
                            },
                            '& .MuiPaginationItem-page.Mui-selected': {
                                backgroundColor: '#333',
                                '&:hover': {
                                    backgroundColor: '#555',
                                }
                            },
                            '& .MuiPaginationItem-ellipsis, & .MuiPaginationItem-previous.Mui-disabled, & .MuiPaginationItem-next.Mui-disabled': {
                                color: '#999',
                            }
                        }}
                    />
                    <Button onClick={() => setOpen(true)} sx={{
                        backgroundColor: '#333',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#555',
                            cursor: 'pointer'
                        }
                    }}>Add Patient</Button>
                </StyledBox>
                <StyledDialog open={open} onClose={() => setOpen(false)}>
                    <form onSubmit={handleFormSubmit}>
                        <DialogContent>
                            <TextField
                                label="Name"
                                name="name"
                                value={newPatient.name}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Surname"
                                name="surname"
                                value={newPatient.surname}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                name="email"
                                label="Email"
                                value={newPatient.email}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Age"
                                name="age"
                                type="number"
                                value={newPatient.age}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <FormControl fullWidth>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    name="sex"
                                    value={newPatient.sex}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={true}>Male</MenuItem>
                                    <MenuItem value={false}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpen(false)}
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
                                type="submit"
                                sx={{
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#555',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                Add
                            </Button>

                        </DialogActions>
                    </form>
                </StyledDialog>
            </StyledPaper>
        </ThemeProvider>
    );
}

export default Filter;
