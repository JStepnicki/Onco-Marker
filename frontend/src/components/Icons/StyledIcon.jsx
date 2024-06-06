import { styled } from '@mui/material/styles';

const StyledIcon = styled('svg')({
    width: '30px',
    height: '30px',
    marginRight: '5px',
    marginLeft: '5px',
    cursor: 'pointer',
    transition: 'transform 0.2s, color 0.2s',
    '&:hover': {
        transform: 'scale(1.5)',
        color: '#1976d2',
    },
});

export default StyledIcon;
