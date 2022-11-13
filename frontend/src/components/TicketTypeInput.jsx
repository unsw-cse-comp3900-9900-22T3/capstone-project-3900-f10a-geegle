import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox, Stack, Paper } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';


function TicketTypeInput( {
  handleAmount,
  handleTicketType,
  handleTicketPrice,
  handleTicketSeatSection,
  index,
  venue
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
      // body: JSON.stringify({
      //   venue: venue.venue
      // })
    });
    const json = (await response.json()).seatSections;
    if (response.ok) {
      //const venueSection = [];
      //venueSection.push(json.seatSections);
      setEventSeatSection([...json]);
      // console.log(venueSection);
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
      type="text"
      variant="outlined"
      onChange={(e) => handleAmount(index, e)}
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
      onChange={(e) => handleTicketPrice(index, e)}
      fullWidth
    />
    </Grid>
    <Grid item xs = {12}>
      {eventSeatSection.map((elem, idx) => {
        return (
          <div key={idx} style={{display: "inline"}}>
            <FormControlLabel
              control = {
                <Checkbox
                  value = {elem}
                  onClick = {(e)=>handleTicketSeatSection(index, e)}
                  // onChange = 
                />
              }
              label = {elem} 
            />
          </div>
          );
        })}
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
)}

TicketTypeInput.propTypes = {
  handleAmount: PropTypes.func,
  handleTicketType: PropTypes.func,
  handleTicketPrice: PropTypes.func,
  index: PropTypes.number
}

export default TicketTypeInput