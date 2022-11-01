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
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
import AccorStadium from '../components/AccorStadium';
import DoltonHouse from '../components/DoltonHouse';
import TicketTypeCard from '../components/TicketTypeCard';
const SeatAllocation= ({
  eventInfo, 
  allSeats, 
  availTicketTypes, 
  quantity}) => {
  const [availSeats, setAvailSeats]= useState([]);
  const [currPickedSeat, setCurrPickedSeat] = useState("");
  const getAvailableSeats = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/availableSeats`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
       },
    });
    const seatData = (await response.json());
    if (response.ok) {
      setAvailSeats(seatData.seats);
    };
    
  }
  const fetchAvailSeatsByTicks = async(ticketType) => {
    const getAvailableSeats = async() => {
      const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/availableSeats`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
         },
      });
      const seatData = (await response.json());
      if (response.ok) {
        setAvailSeats(seatData.seats);
      };
      
    }
  }
  const getAvailableSeatsByTicks = () => {
    let index = 0;
    for (const q of quantity) {
      for (let i=1; i< q; i++) {
        return (
          <>
            <Box key={index} sx={{mt:2}}>
              <FormControl>
                <Typography aria-label="ticket type" variant="h4" width="100%">{availTicketTypes[index].ticketType}</Typography>
                <Typography aria-label="ticket type" variant="h4" width="100%">section type</Typography>


              </FormControl>
            </Box>
          </>
        )
      }
      index++;
    }
  }



  const displaySeatMap = () => {
    if (parseInt(eventInfo.eventVenueId) === 1) {
      return (<AccorStadium/>)
    } else if (parseInt(eventInfo.eventVenueId) === 4) {
      return (<DoltonHouse/>)
    }
  }
  useEffect(()=>{
    // get venue map
    //if ()
  },[])
  
  return (
    <>
      <Box id="seat map" sx ={{mt:'1.5vw'}}>
        {displaySeatMap()}
      </Box>
      <Box id="seat information" sx ={{mt:'1.5vw'}}>
        <Typography aria-label="ticket price" variant="h5" sx={{mt: 2}}>Ticket Name and it's allocated section</Typography>
        <Typography aria-label="ticket price" variant="h5" sx={{mt: 2}}>Ticket Name and it's allocated section</Typography>
      </Box>
      
    </>
    

  );
};
export default SeatAllocation;