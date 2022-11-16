import * as React from 'react';
import AppBar from '@mui/material/AppBar';
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
import { BrowserRouter as Link } from 'react-router-dom';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import { useNavigate } from 'react-router-dom';



const NavBar = ({setLoggedIn}) => {
  const navigate = useNavigate();
  //const [anchorElNav, setAnchorElNav] = React.useState(null);
  //const [anchorElUser, setAnchorElUser] = React.useState(null);

  //const handleOpenNavMenu = (event) => {
    //setAnchorElNav(event.currentTarget);
  // const handleOpenUserMenu = (event) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  const styles = {
    appBar: {
      padding: '0',
      backgroundColor: '#9662f0'
    }
  }

  const handleLogout = (e) => {
    console.log('here')
    localStorage.removeItem('token')
    // localStorage.removeItem('email')
    setLoggedIn(false)
    navigate('/')
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
              <>
                {!localStorage.getItem('token') && <div style={{display:'inline-block'}}>
                  <Link to ='/login' style={{color:'white'}}>
                    Login
                  </Link>
                </div>}
              </>
              <>
                {!localStorage.getItem('token') && <div style={{display:'inline-block'}}>
                  <Link to ='/register' style={{color:'white'}}>
                    Register
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <div style={{display:'inline-block'}}>
                  <Link to ='/event/create' style={{color:'white'}}>
                    Create Events
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <div style={{display:'inline-block'}}>
                  <Link to ='/events/host' style={{color:'white'}}>
                    Host Events
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <div style={{display:'inline-block'}}>
                  <Link to ='/events/myEvent' style={{color:'white'}}>
                    My Events
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <div style={{display:'inline-block'}} onClick>
                  <Link to ='/user/profile' style={{color:'white'}}>
                    My Account
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <div style={{display:'inline-block'}} onClick>
                  <Link to ='/events/calendar' style={{color:'white'}}>
                    My Calendar
                  </Link>
                </div>}
              </>
              <>
                {localStorage.getItem('token') && <button style={{display:'inline-block'}} onClick = {handleLogout}>
                  {/* <Link to ='/' style={{color:'white'}}>
                    Log Out
                  </Link> */}
                  Log Out
                  </button>}
              </>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
