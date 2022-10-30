import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
import AccorStadium from '../components/AccorStadium';
const PurchaseTicket= ({eventInfo, setEventInfo, ticketModal, setTicketModal}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [ticketTypes, setTicketTypes] = useState([]);

  const getTicketTypes = async() => {
    const response = await fetch(`http://localhost:3000//events/${eventInfo.eventId}/ticketTypes`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token'),
      },
    });
    const ticketData = (await response.json());
    if (response.ok) {
      setTicketTypes(ticketData.tickets)
    };
  }
  useEffect(() => {
    getTicketTypes();
  },[])

  console.log("here in modal")
  return (
    <Modal
      open={ticketModal}
      onClose={() => setTicketModal(false) }
      aria-labelledby="ticket modal"
      aria-describedby="purchasing ticket form"
    >
      <Box sx={style}>
        <Typography aria-label="publishForm" id="modal-modal-title" variant="h6" component="h2">
          {eventInfo.eventName}
        </Typography>
        <Typography aria-label="selectYourDates" id="modal-modal-description">
          {`Location ${eventInfo.eventVenue}, ${eventInfo.eventLocation}`}
        </Typography>
        <Typography aria-label="selectYourDates" id="modal-modal-description">
          {`Date: ${eventInfo.startDateTime} - ${eventInfo.endDateTime}`}
        </Typography>
        {/* <Box id="ticket grid" sx ={{}}>

        </Box> */}
        {/* check the seat allocation boolean */}
        <Box id= "seat allocations">
          <AccorStadium/>
          {/* <DoltonHouse /> */}
        </Box>
        
      </Box>
    </Modal>

  );
};
export default PurchaseTicket;