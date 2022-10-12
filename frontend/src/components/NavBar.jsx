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


const NavBar = () => {
  const styles = {
    appBar: {
      padding: '0',
      backgroundColor: '#9662f0'
    }
  }
  return (
    <>
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
            <div style={{display:'flex', gap:'1rem'}}>
              <div style={{display:'inline-block'}}>
                <Link to = '/' style={{color:'white'}}>
                  Home
                </Link>
              </div>
              <div style={{display:'inline-block'}}>
                <Link to ='/login' style={{color:'white'}}>
                  Login
                </Link>
              </div>
              <div style={{display:'inline-block'}}>
                <Link to ='/register' style={{color:'white'}}>
                  Register
                </Link>
              </div>
              <div style={{display:'inline-block'}}>
                <Link to ='/event/create' style={{color:'white'}}>
                  Create Event
                </Link>
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
