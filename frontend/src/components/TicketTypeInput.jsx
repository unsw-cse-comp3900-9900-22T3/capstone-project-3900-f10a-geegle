import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox, Stack, Paper } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import PropTypes from 'prop-types';


function TicketTypeInput({
  handleAmount,
  handleTicketType,
  handleTicketPrice,
  index
}) {
return (
  <Grid container spacing ={3}>
    <Grid item xs = {5}>
      <TextField
      id="Ticket Type"
      label="Ticket Type"
      aria-label="Ticket Type"
      type="text"
      variant="outlined"
      onChange={handleTicketType}
      fullWidth
    />
    </Grid>
    <Grid item xs = {2}>
      <TextField
      id="Quantity"
      label="Quantity"
      aria-label="Quantity"
      type="text"
      variant="outlined"
      onChange={handleAmount}
      fullWidth
    />
    </Grid>
    <Grid item xs = {2}>
      <TextField
      id="price"
      label="price"
      aria-label="price"
      type="text"
      variant="outlined"
      onChange={handleTicketPrice}
      fullWidth
    />
    </Grid>
    {/* <Grid item xs = {2}>
      <Button
        variant ='outlined'
        id = 'addButton'
        onClick = {handleAddTicket}
      > Add 
      </Button>
    </Grid> */}
    
  </Grid>
)

}

TicketTypeInput.propTypes = {
  handleAmount: PropTypes.func,
  handleTicketType: PropTypes.func,
  handleTicketPrice: PropTypes.func,
  index: PropTypes.number
}

export default TicketTypeInput