import React, { useEffect, useState } from 'react';
import { Grid, TextField,Checkbox} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';


/**
 * Component that renders the ticket type input form for the createEventForm component
 * It displays a field for ticket type, quantity and price for each time it is 
 * called. 
 */
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