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
  ticketTypes, 
  quanitity}) => {
  
  const getAvailableSeats = () => {
    return
  }

  const getSeatMap = () => {
    
  }
  useEffect(()=>{
    // get venue map
    //if ()
  },[])
  
  return (
    <>
      <Box id="seat allocation" sx ={{mt:'1.5vw'}}>
        
      </Box>
      
    </>
    

  );
};
export default SeatAllocation;