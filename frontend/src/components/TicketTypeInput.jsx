import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox, Stack, Paper } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import ClearIcon from '@mui/icons-material/Clear';
import PropTypes from 'prop-types';


function TicketTypeInput( {
  handleAmount,
  handleTicketType,
  handleTicketPrice,
  handleTicketSeatSection,
  index,
  venue,
  handleTicketDelete,
  allTicketTypes
}) {
  const [eventSeatSection, setEventSeatSection] = useState([]);
  const fetchSeatSection = async () => {
    console.log(venue);
    const response = await fetch(`http://localhost:3000/events/venues/${venue}/seatSections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    });
    const json = (await response.json()).seatSections;
    if (response.ok) {
      setEventSeatSection([...json]);
    }
  }
  useEffect(() => {
    fetchSeatSection();
  }, [venue])
  

return (
  <Grid container spacing ={3}>
    <Grid item xs = {5}>
      <TextField
      id="Ticket Type"
      label="Ticket Type"
      aria-label="Ticket Type"
      type="text"
      variant="outlined"
      onChange={(e) => handleTicketType(index, e)}
      fullWidth
    />
    </Grid>
    <Grid item xs = {2}>
      <TextField
      id="Quantity"
      label="Quantity"
      aria-label="Quantity"
      type="number"
      variant="outlined"
      value = {allTicketTypes[index].quantity}
      onChange={(e) => handleAmount(index, e)}
      fullWidth
    />
    </Grid>
    <Grid item xs = {2}>
      <TextField
      id="price"
      label="price"
      aria-label="price"
      type="number"
      variant="outlined"
      onChange={(e) => handleTicketPrice(index, e)}
      fullWidth
      />
    </Grid>
    {index !== 0 ? (
      <Grid item xs = {3}>
        <Button 
          style={{marginRight: "15px",width: "8rem", fontSize: "1.3rem", backgroundColor: "#9579e7"}}
          variant="contained"
          size="large"
          onClick ={(e) => handleTicketDelete(index, e)}
          >
            Delete
          </Button>
      </Grid>
    ) : null}
    
    <Grid item xs = {12}>
      {eventSeatSection.map((elem, idx) => {
        return (
          <div key={idx} style={{display: "inline"}}>
            <FormControlLabel
              control = {
                <Checkbox
                  value = {elem}
                  onClick = {(e)=>handleTicketSeatSection(index, e)}
                />
              }
              label = {elem} 
            />
          </div>
          );
        })}
    </Grid>
  </Grid>
)}

TicketTypeInput.propTypes = {
  handleAmount: PropTypes.func,
  handleTicketType: PropTypes.func,
  handleTicketPrice: PropTypes.func,
  index: PropTypes.number
}

export default TicketTypeInput