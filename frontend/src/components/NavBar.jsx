import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from 'react-router-dom';
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const NavBar = () => {
  //const [anchorElNav, setAnchorElNav] = React.useState(null);
  //const [anchorElUser, setAnchorElUser] = React.useState(null);

  //const handleOpenNavMenu = (event) => {
    //setAnchorElNav(event.currentTarget);
  //};
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };
  const styles = {
    appBar: {
      padding: '0',
      backgroundColor: '#cfabed'
    }
  }
  return (
    <AppBar position="static" sx={{bgcolor: '#cfabed'}}>
      <Container maxWidth="xl" style={{backgroundColor: '#cfabed'}}>
        <Toolbar style={{backgroundColor: '#cfabed'}}>
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EVENTFUL
          </Typography>
          <div>
            <div>
              <Link to = '/'>
                Home
              </Link>
            </div>
            <div >
              <Link to ='/login'>
                Login
              </Link>
            </div>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
