import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
import AccorStadium from '../components/AccorStadium';
import DoltonHouse from '../components/DoltonHouse';
import TicketTypeCard from '../components/TicketTypeCard';
const PurchaseTicket= ({
  eventInfo, 
  setEventInfo, 
  ticketModal, 
  setTicketModal}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [availTicketTypes, setAvailTicketTypes] = useState([]); // this is non-sold out ticket types for the event
  const [quantity, setQuantity] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inputError, setInputError] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [exceedError, setExceedError] = useState(false);
  const [inputErrorTic, setInputErrorTic] = useState("");
  const [ticketTypeExceeded, setTicketTypeExceeded] = useState("");
  const [allSeats, setAllSeats] = useState([]);
  const [hasSeats, setHasSeats] = useState(false);
  // page 1 is ticket selection page
  // page 2 is seat allocation page
  // page 3 is confirmation page
  const [currentPage, setCurrentPage] = useState(1);
  const [seatAllocationPage, setSeatAllocationPage] = useState(false);
  const [confirmationPage, setConfirmationPage] = useState(false);
  const dateOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  }
  const handleNextPage = () => {
    // check for input error 
    if (currentPage === 1) {
      // reset the error states
      setInputError(false);
      setExceedError(false);
      let idx = 0;
      for (const qty of quantity) {
        if (isNaN(qty)) {
          console.log("here");
          console.log(qty)
          setInputError(true);
          setInputErrorTic(availTicketTypes[idx].ticketType);
          return;
        }
      idx++;
      }
      // check for quantity exceeding the remaining ticket
      idx = 0;
      for (const qty of quantity) {
        if (parseInt(qty) > parseInt(availTicketTypes[idx].remaining)) {
          setExceedError(true);
          setTicketTypeExceeded(availTicketTypes[idx].ticketType);
          return;
        }
        idx++;
      }
      // when there are no errors then we allow the use to go to the 
      // next page for seat allocations
      if (inputError === false && exceedError === false) {
        // go to page 2
        if (hasSeats === true) {
          seatAllocationPage(true);
          setCurrentPage(2);
        } else {
          // go to confirmation page
          // setCurrentPage(3)
        }
      } else {
        // stay in page 1
        seatAllocationPage(false);
        // confirmation page is false
        // set current page back to 1
        setCurrentPage(1)
      }
    } 
    
  }
  const handleQuantity = (event, index) => {
    let newQty = event.target.value;
    let tempQtys = [...quantity];
    tempQtys[index] = newQty;
    setQuantity(tempQtys);

    // updating the total price
    let newTotal = 0;
    let idx = 0;
    for (const qty of tempQtys) {
      // skipping on adding if the number is not a number
      if (!isNaN(parseInt(qty))) {
        
        newTotal = newTotal + parseInt(qty)*(availTicketTypes[idx].price);
      }
      idx++;
    }
    setTotalPrice(newTotal);
    
  }

  // get available ticket types
  const getAvailTicketTypes = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/availableTicketGroup`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
       },
    });
    const ticketData = (await response.json());
    if (response.ok) {
      setAvailTicketTypes(ticketData.tickets)
    };
  }

  // get seats for the event
  const getSeats = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/seats`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
       },
    });
    const seatData = (await response.json());
    if (response.ok) {
      setAllSeats(seatData.seats);
      if ((seatData.seats).length === 0) {
        setHasSeats(false);
      } else {
        setHasSeats(true);
        
      }
    };
  }

  const pageControl = () => {
    if (currentPage === 1) {
      return (
        <>
          <Box id="ticket container" sx ={{mt:'1.5vw'}}>
            {availTicketTypes.map((ticket,index) => {
              return <TicketTypeCard  
              eventInfo = {eventInfo}
              setEventInfo = {setEventInfo} 
              quantity = {quantity}
              setQuantity = {setQuantity}
              handleQuantity = {handleQuantity}
              index = {index}
              ticket = {ticket}
              key={index}/>
            })}
          </Box>
          <Box id="total price section" sx={{mt: 4}}>
            <Typography aria-label="total price" variant="h5" width="100%">
              Total ticket price: ${totalPrice}
            </Typography>
          </Box>
        </>
      )
    } 
  }
  useEffect(() => {
    getAvailTicketTypes();
    getSeats();
  },[])

  console.log("here in modal")
  return (
    <Modal
      open={ticketModal}
      onClose={() => setTicketModal(false) }
      aria-labelledby="ticket modal"
      aria-describedby="purchasing ticket form"
    >
      <Box sx={style}>
        <Typography aria-label="event name" id="modal-modal-title" variant="h6">
          {eventInfo.eventName}
        </Typography>
        <Typography aria-label="event location" id="modal-modal-description">
          {`Location ${eventInfo.eventVenue}, ${eventInfo.eventLocation}`}
        </Typography>
        <Typography aria-label="event dates" id="modal-modal-description">
          {`Date: ${(new Date(eventInfo.startDateTime)).toLocaleString('en-AU',dateOptions)} to ${(new Date(eventInfo.endDateTime)).toLocaleString('en-AU',dateOptions)}`}
        </Typography>
        {currentPage === 1 ? (
          <>
            <Box id="ticket container" sx ={{mt:'1.5vw'}}>
              {availTicketTypes.map((ticket,index) => {
                return <TicketTypeCard  
                eventInfo = {eventInfo}
                setEventInfo = {setEventInfo} 
                quantity = {quantity}
                setQuantity = {setQuantity}
                handleQuantity = {handleQuantity}
                index = {index}
                ticket = {ticket}
                key={index}/>
              })}
            </Box>
            <Box id="total price section" sx={{mt: 4}}>
              <Typography aria-label="total price" variant="h5" width="100%">
                Total ticket price: ${totalPrice}
              </Typography>
            </Box>
          </>
        ) : null}
        

        
        <Box id="navigation buttons">
          <Button 
            variant="contained"
            onClick={() => setTicketModal(false) }>
              Close
          </Button>
          <Button 
            variant="contained"
            onClick = {event => handleNextPage()}
          >
            Next
          </Button>
        </Box>
        {inputError === true 
          ? (<Alert severity="error">Error, make sure quanity for {inputErrorTic} are numbers before going to next page</Alert>) 
          : null}
        {exceedError === true 
          ? (<Alert severity="error">Error, quantity exceeded for {ticketTypeExceeded} is below the remaining ticket</Alert>) 
          : null}
    
        
      </Box>
    </Modal>

  );
};
export default PurchaseTicket;