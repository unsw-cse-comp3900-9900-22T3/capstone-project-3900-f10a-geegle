/* eslint-disable */ 
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Card, Grid} from '@mui/material';
import AccorStadium from '../components/AccorStadium';
import DoltonHouse from '../components/DoltonHouse';
import SeatSelectionCard from '../components/SeatSelectioncard';

/**
 *  This component allows user to select their seats when purchasing a ticket that is a 
 *  seated event. This component renders page 2 of the purchasing ticket form.
 */
const SeatAllocation= ({
  eventInfo, 
  availTicketTypes, 
  quantity,
  chosenSeats,
  setChosenSeats}) => {
  
  const [seatingSectionAllocation, setSeatingSectionAllocation] = useState({});
  const [seatSections, setSeatSections] = useState([]);
  const [availSeats, setAvailSeats] = useState([]);
  const [unAvailSeats, setUnAvailSeats] = useState([]);
  const [currentSelected, setCurrentSelected] = useState('');


 /**
  * fetch seating sections for the event
  */
  const fetchSeatingSectionAllocation = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/seatSectionsTicketAllocation`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
        },
    });
    const seatData = (await response.json());
    if (response.ok) {
      setSeatingSectionAllocation(seatData.seatSections);
      const seatKeys = Object.keys(seatData.seatSections);
      setSeatSections(seatKeys);
    }
  }
  
  // fetch all available seats for the event
  const fetchAvailSeats = async() => {
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
    }
  }

  // fetch unavailable seats for the event
  const fetchUnAvailSeats = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/purchasedSeats`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
        },
    });
    const seatData = (await response.json());
    if (response.ok) {
      setUnAvailSeats(seatData.seats);
    }
  }
  
  // display the correct event map for the venue
  const displaySeatMap = () => {
    if (parseInt(eventInfo.eventVenueId) === 1) {
      return (<AccorStadium  
        unAvailSeats={unAvailSeats} 
        availSeats={availSeats}
        currentSelected={currentSelected}/>)
    } else if (parseInt(eventInfo.eventVenueId) === 4) {
      return (<DoltonHouse  
        unAvailSeats={unAvailSeats} 
        availSeats={availSeats}
        currentSelected={currentSelected}/>)
    }
  }

  useEffect(()=>{
    fetchSeatingSectionAllocation();
    fetchAvailSeats();
    fetchUnAvailSeats();
    let chosenSeatsArray = [];

    // initialising chosenSeats array that will store the seats chosen by the customer
    // for each ticket that they have chosen 
    quantity.forEach((q, ticketTypeIdx) => {
      for(let ticketNum=0; ticketNum< q; ticketNum++) {
        const newSeatInfo = {
        ticketType: availTicketTypes[ticketTypeIdx].ticketType,
        section: '',
        seatId: ''
        }
        chosenSeatsArray.push(newSeatInfo);   
      }
    })
    setChosenSeats(chosenSeatsArray)
  },[])

  return (
    <>
      <Box id="seat allocation title">
        <Typography variant="h5" style={{mt:'10px', fontWeight: 'bold'}}>Choose your seats</Typography>
      </Box>
      <Box id="seat map" sx ={{mt:'1.5vw'}}>
        {displaySeatMap()}
      </Box>
      <Box id="seat information" sx ={{mt:'1.5vw', display:'flex', gap:'10px'}}>
        <Card sx={{p:2}}>
          {seatSections.map((section,idx)=> {
            return(
              <Box>
                <Typography aria-label="section" variant="body1">Tickets Types For {section}:</Typography>
                <Box sx={{display:'flex', gap:'20px'}}>
                  {seatingSectionAllocation[`${section}`].map((ticketType,idx2)=> {
                    return (
                      <Typography aria-label="ticket type for section" variant="body2">{ticketType}</Typography>
                    )
                  })}
                </Box> 
              </Box>
            )
          })}
        </Card>
        <Card sx={{p:2}}>
          <Typography aria-label="section" variant="body1" style={{color:"Red"}}> Red: unavailable Seats</Typography>
          <Typography aria-label="section" variant="body1" style={{color:"Green"}}> Green: available Seats</Typography>
          <Typography aria-label="section" variant="body1" style={{color:"Blue"}}> Blue: Seat Selector Indicator</Typography>
        </Card>
      </Box>
      <Box id="seat allocation form" sx ={{mt:'1.5vw'}}>
        <Grid container spacing={2}>
          {chosenSeats.map((seat, index) => {
              return (<SeatSelectionCard
                singleTicketType={seat.ticketType}
                index={index}
                seatingSectionAllocation={seatingSectionAllocation}
                eventInfo={eventInfo}
                chosenSeats={chosenSeats}
                setChosenSeats={setChosenSeats}
                key={index}
                setCurrentSelected={setCurrentSelected}
                />)  
            }
          )}
        </Grid>
      </Box>
      
      
    </>
    

  );
};
export default SeatAllocation;