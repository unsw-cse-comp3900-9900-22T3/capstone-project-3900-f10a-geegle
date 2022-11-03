import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { InputLabel,Select, MenuItem } from '@mui/material';
import AccorStadium from '../components/AccorStadium';
import DoltonHouse from '../components/DoltonHouse';
import TicketTypeCard from '../components/TicketTypeCard';
import { set } from 'date-fns/esm';
const SeatSelectionCard= ({
  singleTicketType, 
  index,
  seatingSectionAllocation,
  eventInfo,
  chosenSeats,
  setChosenSeats,
  setCurrentSelected
   }) => {

  const [ticketTypeSeatSections, setTicketTypeSeatSections] = useState([]); // variable that stores all the sections allocated to the ticket type
  const [seatsFromChosenSection, setSeatsFromChosenSection] = useState([]); // stores seats by sections for the current ticket type, the index correlates to ticketTypeSeatSections
  const [chosenSection, setChosenSection] = useState('');
  const [chosenSeat, setChosenSeat] = useState('');
  console.log('index', index);
  console.log('chosenSeats',chosenSeats );
  console.log(seatingSectionAllocation);


  const handleSeatChange = async(event)=> {
    const newChosenSeats = [...chosenSeats];
    const selectedSeat = JSON.parse(event.target.value);
    console.log("chosen seat Obj", selectedSeat);
    setChosenSeat(selectedSeat);
    newChosenSeats[index].section = chosenSection;
    newChosenSeats[index].seatId = selectedSeat;
    setChosenSeats(newChosenSeats);
    console.log("new chosen seats", newChosenSeats);
    setCurrentSelected(selectedSeat);

  }
  const handleSectionChange = async(event) => {
    const section = event.target.value;
    setChosenSection(section);
    const seatsFromSection = await fetchAvailSeatsBySec(section);
    setSeatsFromChosenSection(seatsFromSection);
    console.log('seatsFromSection', seatsFromSection);
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
    console.log('seatData',seatData);
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
  const getSectionsFromTicketType = (ticketType) => {
    // get keys from seatingSection
    const sectionsForTicket = [];
    console.log("ticket type", ticketType);
    console.log("seating section allocation",seatingSectionAllocation);
    const sections = Object.keys(seatingSectionAllocation);
    for (const s of sections) {
      console.log("s",s);
      if ((seatingSectionAllocation[`${s}`]).includes(ticketType)) {
        sectionsForTicket.push(s)
      }
    }
    return sectionsForTicket;
  }

  useEffect(()=> {
    const sectionsForTicket = getSectionsFromTicketType(singleTicketType);
    console.log('sections for tick',sectionsForTicket);
    setTicketTypeSeatSections(sectionsForTicket);
    console.log(singleTicketType);
    console.log(sectionsForTicket);
  },[seatingSectionAllocation])
  
  
  return (
    <>
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
                console.log("seat",seat);
                return (
                  <MenuItem key={seatIdx} value={seat.seatid}>Row:{seat.seatRow} Seat Number: {seat.seatNo}</MenuItem>
                )
              })}
            </Select>
            
          </FormControl>
        </FormControl>
      </Box>
    </>
    

  );
};
export default SeatSelectionCard;