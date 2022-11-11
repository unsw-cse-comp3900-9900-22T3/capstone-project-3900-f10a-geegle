import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import { GifBoxOutlined } from '@mui/icons-material';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const HostProfile=()=> {

  const [open, setOpen] = React.useState(true);
  const [hostInfo, setHostInfo] = React.useState({});
  const navigate = useNavigate();
  const {hostId} = useParams();
  const state = useLocation();
  const eventId = state.state;
  // console.log(eventObj);

  const handleClose = () => {
    navigate('/');
    //navigate(`/event/view/${eventId}`);
    setOpen(false);
  };

  const fetchHostInfo = async() => {
    const response = await fetch(`events/host/details/${hostId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify({hostID:hostId})
    })
    const json = await response.json();
    setHostInfo(json)
    console.log(json)
  }

  React.useEffect(() => {
    fetchHostInfo();
  }, [])

  return(
<div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="host-profile-modal"
        aria-describedby="host rating and reviews"
        arial-modal={true}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Host Profile
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Host Name: {hostInfo.hostName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Host Rating: {hostInfo.hostRating.toFixed(2)}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};
export default HostProfile;