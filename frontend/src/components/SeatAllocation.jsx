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
import SeatSelectionCard from '../components/SeatSelectioncard';
const SeatAllocation= ({
  eventInfo, 
  availTicketTypes, 
  quantity,
  chosenSeats,
  setChosenSeats}) => {
  
  const [seatingSectionAllocation, setSeatingSectionAllocation] = useState({});
  const [seatSections, setSeatSections] = useState([]);

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
      console.log('seat data frist instance',seatData);
      setSeatingSectionAllocation(seatData.seatSections);
      const seatKeys = Object.keys(seatData.seatSections);
      setSeatSections(seatKeys);
    }
  }
  
  
  const displaySeatMap = () => {
    if (parseInt(eventInfo.eventVenueId) === 1) {
      return (<AccorStadium/>)
    } else if (parseInt(eventInfo.eventVenueId) === 4) {
      return (<DoltonHouse/>)
    }
  }

  useEffect(()=>{
    fetchSeatingSectionAllocation();
    let chosenSeatsArray = [];
    quantity.map((q, ticketTypeIdx) => {
      for(let ticketNum=0; ticketNum< q; ticketNum++) {
        const newSeatInfo = {
        ticketType: availTicketTypes[ticketTypeIdx].ticketType,
        section: '',
        seatId: ''
        }
        chosenSeatsArray.push(newSeatInfo);   
      }
    })
    console.log("chosen seats array",chosenSeatsArray);
    setChosenSeats(chosenSeatsArray)
  },[])

  return (
    <>
      <Box id="seat map" sx ={{mt:'1.5vw'}}>
        {displaySeatMap()}
      </Box>
      <Box id="seat information" sx ={{mt:'1.5vw'}}>
        {seatSections.map((section,idx)=> {
          return(
            <Box>
              <Typography aria-label="section" variant="h5" sx={{mt: 2}}>Tickets Types For {section}:</Typography>
              <Box sx={{display:'flex', gap:'20px'}}>
                {seatingSectionAllocation[`${section}`].map((ticketType,idx2)=> {
                  return (
                    <Typography aria-label="ticket type for section" variant="h6" sx={{mt: 2}}>{ticketType}</Typography>
                  )
                })}
              </Box> 
            </Box>
          )
        })}
      </Box>
      <Box id="seat allocation form" sx ={{mt:'1.5vw'}}>
        {chosenSeats.map((seat, index) => {
            return (<SeatSelectionCard
              singleTicketType={seat.ticketType}
              index={index}
              seatingSectionAllocation={seatingSectionAllocation}
              eventInfo={eventInfo}
              chosenSeats={chosenSeats}
              setChosenSeats={setChosenSeats}
              key={index}
               />)  
          }
        )}
      </Box>
      
      
    </>
    

  );
};
export default SeatAllocation;