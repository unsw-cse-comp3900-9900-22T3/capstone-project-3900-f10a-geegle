import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { FormControl } from '@mui/material';


/**
 * Function that renders non-sold out ticket groups for the PurchseTicket component.
 * It renders available tickets that user's can select to purchase.
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
          type="number"
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