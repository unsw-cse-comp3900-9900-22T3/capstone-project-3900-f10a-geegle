import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FormControl, Grid } from '@mui/material';
import { InputLabel,Select, MenuItem } from '@mui/material';


/**
 * Component that renders available seating options and 
 * non taken seats for each ticket that 
 * the user has selected
 */
const SeatSelectionCard= ({
  singleTicketType, 
  index,
  seatingSectionAllocation,
  eventInfo,
  chosenSeats,
  setChosenSeats,
  setCurrentSelected
   }) => {
  
  // variable that stores all the sections allocated to the ticket type
  const [ticketTypeSeatSections, setTicketTypeSeatSections] = useState([]); 
  // stores seats by sections for the current ticket type, the index correlates to ticketTypeSeatSections
  const [seatsFromChosenSection, setSeatsFromChosenSection] = useState([]); 
  const [chosenSection, setChosenSection] = useState('');
  const [chosenSeat, setChosenSeat] = useState('');
  

  // function that handles the changes when the user picks a seat in a section 
  const handleSeatChange = async(event)=> {
    const newChosenSeats = [...chosenSeats];
    const selectedSeat = JSON.parse(event.target.value);
    setChosenSeat(selectedSeat);
    newChosenSeats[index].section = chosenSection;
    newChosenSeats[index].seatId = selectedSeat;
    setChosenSeats(newChosenSeats);
    setCurrentSelected(selectedSeat);

  }

  // function that handles the changes when an available seating section is picked by the user
  const handleSectionChange = async(event) => {
    const section = event.target.value;
    setChosenSection(section);
    const seatsFromSection = await fetchAvailSeatsBySec(section);
    setSeatsFromChosenSection(seatsFromSection);
  }
  /**
   * 
   * Function that returns the seats avail for the ticket type in this component 
   * and the specifield section
   */
  const fetchAvailSeatsBySec = async(section) => {
    let allSeats = [];
    let allSeatsInSec = [];
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/availableSeatsByTicketType/${singleTicketType}`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
        },
    });
    const seatData = (await response.json());
  
    if (response.ok) {
      allSeats = seatData.seats;
      allSeats.forEach((seat)=> {
        if(seat.seatSection === section) {
          allSeatsInSec.push(seat);
        }
      }) 
    };
    return allSeatsInSec;
  }

  /**
   *  Arranges seat section allocation data into an array 
   */
  const getSectionsFromTicketType = (ticketType) => {
    // get keys from seatingSection
    const sectionsForTicket = [];
    const sections = Object.keys(seatingSectionAllocation);
    for (const s of sections) {
      if ((seatingSectionAllocation[`${s}`]).includes(ticketType)) {
        sectionsForTicket.push(s)
      }
    }
    return sectionsForTicket;
  }

  useEffect(()=> {
    const sectionsForTicket = getSectionsFromTicketType(singleTicketType);
    setTicketTypeSeatSections(sectionsForTicket);
  },[seatingSectionAllocation])
  
  
  return (
    <Grid item xs={3}>
      <Box key={index} sx={{mt:2}}>
        <FormControl>
          <Typography aria-label="ticket type" variant="h4" width="100%">Ticket {index+1}: {singleTicketType}</Typography>
          <Typography aria-label="ticket type" variant="h5" width="100%">Choose Sections:</Typography>
          <FormControl fullWidth>
            <InputLabel>Available Sections</InputLabel>
            <Select
              value={chosenSection}
              label="section"
              onChange={(event) => handleSectionChange(event)}
            >
              {ticketTypeSeatSections.map((section,sectionIdx) => {
                return (
                  <MenuItem key={sectionIdx}value={section}>{section}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Pick a Seat</InputLabel>
            <Select
              value={chosenSeat}
              label="Pick Seat"
              onChange={(event) => handleSeatChange(event)}
            >
              {seatsFromChosenSection.map((seat,seatIdx) => {
                if(seat.seatRow !== null) {
                  return (
                    <MenuItem key={seatIdx} value={seat.seatid}>Row:{seat.seatRow} Seat Number: {seat.seatNo}</MenuItem>
                  )
                } else {
                  return (
                    <MenuItem key={seatIdx} value={seat.seatid}>Seat Number: {seat.seatNo}</MenuItem>
                  )
                }
              })}
            </Select>
            
          </FormControl>
        </FormControl>
      </Box>
    </Grid>
    

  );
};
export default SeatSelectionCard;