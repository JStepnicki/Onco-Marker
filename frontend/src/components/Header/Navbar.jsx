import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#333',
  display: 'flex',
  justifyContent: 'space-between',
});

function Navbar() {
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout/');
        window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <div>
          <Button color="inherit" component={RouterLink} to="/">Main Page</Button>
          <Button color="inherit" component={RouterLink} to="/doctors">Doctor Page</Button>
        </div>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
