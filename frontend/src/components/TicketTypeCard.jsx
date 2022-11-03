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

/**
 * Function that renders non-sold out ticket groups
 */
const TicketTypeCard= ({
  eventInfo, 
  setEventInfo, 
  quantity, 
  setQuantity,
  handleQuantity,
  index,
  ticket,
  }) => {
  
  return (   
    <Card sx={{p:2}} key={index}>
      <Typography aria-label="ticket type" variant="h4" width="100%">{ticket.ticketType}</Typography>
      <FormControl >
        <Typography aria-label="ticket price" variant="h5" sx={{mt: 2}}>Price: ${ticket.price}</Typography>
        <Typography aria-label="ticket price" variant="h5" sx={{mt: 2}}>Remaining tickets: {ticket.remaining}</Typography>
        <Typography aria-label="quantity label" sx={{mt: 2}}>
          Quantity:
        </Typography>
        <TextField
          label="quantity"
          type="text"
          variant="outlined"
          aria-label="quantity textbox"
          defaultValue={0}
          onChange={event=>handleQuantity(event,index)}
          fullWidth
        />  
      </FormControl>
    </Card>
  );
};
export default TicketTypeCard;