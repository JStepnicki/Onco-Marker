import React from 'react';
import {AppBar, Toolbar, Typography, Button, Pagination, Box} from "@mui/material";
import {styled} from "@mui/system";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import ManIcon from '../Icons/Man.jsx';
import WomanIcon from '../Icons/Woman.jsx';

const StyledBox = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
});

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

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#fff',
    padding: "4px",
    marginBottom: "16px",
    borderRadius: "4px",
});

function TopBar({patient, handleDialogOpen, page, setPage, totalItems}) {
    return (
        <ThemeProvider theme={theme}>
            <StyledAppBar position="static">
                <Toolbar>
                    <StyledBox>
                        <Typography variant="h6" sx={{color: '#333'}}>
                            {patient.sex === true ? <ManIcon/> : <WomanIcon/>} {patient.name} {patient.surname},
                            Age {patient.age}
                        </Typography>
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
                        <Button color="inherit" onClick={handleDialogOpen} sx={{
                            backgroundColor: '#333',
                            color: '#fff',
                            flexShrink: 1,
                            width: '150px',
                            '&:hover': {
                                backgroundColor: '#555',
                                cursor: 'pointer'
                            }
                        }}>
                            Add New Sample
                        </Button>
                    </StyledBox>
                </Toolbar>
            </StyledAppBar>
        </ThemeProvider>
    );
}

export default TopBar;
