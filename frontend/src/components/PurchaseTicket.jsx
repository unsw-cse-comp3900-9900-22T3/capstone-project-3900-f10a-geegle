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
import DoltonHouse from '../components/DoltonHouse';
const PurchaseTicket= ({
  eventInfo, 
  setEventInfo, 
  ticketModal, 
  setTicketModal}) => {
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
  const [quantity, setQuantity] = useState("");
  const dateOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  }
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
        <Typography aria-label="event name" id="modal-modal-title" variant="h6">
          {eventInfo.eventName}
        </Typography>
        <Typography aria-label="event location" id="modal-modal-description">
          {`Location ${eventInfo.eventVenue}, ${eventInfo.eventLocation}`}
        </Typography>
        <Typography aria-label="event dates" id="modal-modal-description">
          {`Date: ${(new Date(eventInfo.startDateTime)).toLocaleString('en-AU',dateOptions)} to ${(new Date(eventInfo.endDateTime)).toLocaleString('en-AU',dateOptions)}`}
        </Typography>
        <Box id="ticket container" sx ={{mt:'1.5vw'}}>
          <Card sx={{p:2}}>
            <Typography aria-label="ticket type" variant="h4" width="100%">General Admission</Typography>
            <FormControl >
              <Typography aria-label="ticket price" variant="h5" sx={{mt: 2}}>Price: $100</Typography>
              <Typography aria-label="quantity label" sx={{mt: 2}}>
                Quantity:
              </Typography>
              <TextField
                id="quantity"
                label="quantity"
                type="text"
                variant="outlined"
                aria-label="quantity textbox"
                onChange={e=>setQuantity(e.target.value)}
                fullWidth
              />  
            </FormControl>
          </Card>
        </Box>
        <Box id="total section" sx={{mt: 4}}>
          <Typography aria-label="total price" variant="h5" width="100%">
            Total ticket price: $500
          </Typography>
        </Box>
        {/* check the seat allocation boolean */}
        <Box id= "seat allocations">
          {/* <AccorStadium/> */}
          {/* <DoltonHouse /> */}
        </Box>
        
      </Box>
    </Modal>

  );
};
export default PurchaseTicket;