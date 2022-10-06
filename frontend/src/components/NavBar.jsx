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
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const NavBar = () => {
  //const [anchorElNav, setAnchorElNav] = React.useState(null);
  //const [anchorElUser, setAnchorElUser] = React.useState(null);

  //const handleOpenNavMenu = (event) => {
    //setAnchorElNav(event.currentTarget);
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
      backgroundColor: '#9662f0'
    }
  }
  return (
    <>
    <Router>
      <AppBar position="static" sx={{bgcolor: '#9662f0'}}>
        <Container maxWidth="xl" style={{backgroundColor: '#9662f0'}}>
          <Toolbar style={{backgroundColor: '#9662f0'}}>
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
              <Link to = '/'><div style={{display:'inline-block'}}>Home&nbsp;|</div></Link>
                {/* <div>Home</div> */}
              <Link to ='/login'><div style={{display:'inline-block'}}>&nbsp;Login&nbsp;|</div></Link>
              <Link to ='/register'><div style={{display:'inline-block'}}>&nbsp;Register&nbsp;</div></Link>
              {/* <div>Login</div> */}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
        <Routes>
          <Route path={`/`} element={<div>Home Page</div>}></Route>
          <Route path={`/login`} element={<LoginPage></LoginPage>}></Route>
          <Route path={`/register`} element={<RegisterPage></RegisterPage>}></Route>
        </Routes>
      </Router>
    </>
  );
};
export default NavBar;
