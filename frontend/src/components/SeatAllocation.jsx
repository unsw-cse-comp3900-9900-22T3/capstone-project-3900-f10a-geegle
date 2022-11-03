import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Card} from '@mui/material';
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
  const [availSeats, setAvailSeats] = useState([]);
  const [unAvailSeats, setUnAvailSeats] = useState([]);
  const [currentSelected, setCurrentSelected] = useState('');

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
      console.log('avail',seatData.seats);
    }
  }

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
      console.log('unavail',seatData.seats);
    }
  }
  
  
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
      </Box>
      
      
    </>
    

  );
};
export default SeatAllocation;