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
import SeatAllocation from '../components/SeatAllocation';
import PaymentConfirmation from '../components/PaymentConfirmation';
import { KeyboardReturnRounded } from '@mui/icons-material';
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
    height: '50vw',
    overflow:'scroll'
  };
  const dateOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [availTicketTypes, setAvailTicketTypes] = useState([]); // this is non-sold out ticket types for the event
  const [quantity, setQuantity] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [inputError, setInputError] = useState(false);
  const [exceedError, setExceedError] = useState(false);
  const [inputErrorTic, setInputErrorTic] = useState("");
  const [ticketTypeExceeded, setTicketTypeExceeded] = useState("");
  const [hasSeats, setHasSeats] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const [checkoutErrorMsg, setCheckoutErrorMsg] = useState(false);



  // page 1 is ticket selection page
  // page 2 is seat allocation page
  // page 3 is payment and confirmation page

  // seat allocation page variables (page 2)
  const [duplicateError, setDuplicateError] = useState(false);
  const [chosenSeats, setChosenSeats] = useState([{
    ticketType: '',
    section: '',
    seatId: ''
  }]);
  
  // payment confirmation page variables (page 3)
  const [paymentOption, setPaymentOption] = useState("stored");
  const [newCreditCardNum, setNewCreditCardNum] = useState('');
  const [newCCV, setNewCCV] = useState('');
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState('');
  


  /**
   * handleNextPage error checks the current page before
   * going to the next page
   */
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
          setCurrentPage(2);
        } else {
          // go to payment page
          setCurrentPage(3)
        }
      } else {
        // stay in page 1
        setCurrentPage(1)
      }
    } else if (currentPage === 2) {
      setDuplicateError(false);
      const seatIdChosen = chosenSeats.map((seat,index) => {
        return seat.seatId;
      })

      const duplicate = seatIdChosen.some((seat,index)=> seatIdChosen.indexOf(seat) !== index
      )
      if (duplicate === true) {
        setDuplicateError(true);
        setCurrentPage(2)
      } else {
        setDuplicateError(false);
        // no error, allow user to move to the next page
        setCurrentPage(3);
      }


    }
  }
  const handleCheckout = async(event, index) => {

    // convert chosenSeats key into an array
    // the below arrays are related by their index
    // index represent's the particular ticket
    setCheckoutSuccess(false);
    setCheckoutError(false);
    const tickets = chosenSeats.map((obj, index)=> obj.ticketType);
    console.log('ticket', tickets);
    const section = chosenSeats.map((obj, index)=> obj.section);
    let seatId = chosenSeats.map((obj, index)=> obj.seatId); 
    let jsonString = "";
    if(hasSeats === false) {
      seatId = [];
    }
    console.log('seat id', seatId);
    if (paymentOption === "stored") {
      jsonString = JSON.stringify({
        tickets: tickets,
        seats: seatId,
        creditCard: {
          useStored: true,
          creditCardNum:"",
          ccv:"",
          expiryMonth:"",
          expiryYear:""
        }
      });
    } else {
      // paymentOption is notStored
      jsonString = JSON.stringify({
        tickets: tickets,
        seats: seatId,
        creditCard: {
          useStored: false,
          creditCardNum: newCreditCardNum,
          ccv: newCCV,
          expiryMonth: newMonth,
          expiryYear: newYear
        }
      });
    }
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: jsonString

    };
    const r = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/purchase`, requestOptions)
    if (r.ok ) {
      setCheckoutSuccess(true);
    } else {
      setCheckoutError(true);
      setCheckoutErrorMsg(r);
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
      //for ()
    };
  }

  // check if event has seat allocated to it
  const eventHasSeats = async() => {
    if (eventInfo.seatedEvent === true) {
      setHasSeats(true);
    } else {
      setHasSeats(false);
    }
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
    } else if (currentPage === 2) {
      return (<SeatAllocation 
        eventInfo = {eventInfo}
        availTicketTypes = {availTicketTypes}
        quantity = {quantity}
        chosenSeats={chosenSeats}
        setChosenSeats={setChosenSeats}/>)
    } else if (currentPage === 3) {
      return (
        <PaymentConfirmation
        paymentOption = {paymentOption}
        setPaymentOption = {setPaymentOption}
        setNewCreditCardNum= {setNewCreditCardNum}
        setNewCCV={setNewCCV}
        setNewMonth={setNewMonth}
        setNewYear={setNewYear}
        hasSeats={hasSeats}
        quantity={quantity}
        availTicketTypes={availTicketTypes}
        setChosenSeats={setChosenSeats}
        />
      )
    }
  }
  const nextOrCheckoutButton = () => {
    if (currentPage === 1 || currentPage === 2) {
      return (
        <Button 
            variant="contained"
            onClick = {event => handleNextPage()}
          >
            Next
        </Button>
      )
    } else if (currentPage === 3) {
        return(
          <Button 
            variant="contained"
            onClick = {event => handleCheckout()}
          >
            Check out
          </Button>
        )
       
    }
  }
  useEffect(() => {
    getAvailTicketTypes();
    eventHasSeats();
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
        {pageControl()}
        
        <Box id="navigation buttons">
          <Button 
            variant="contained"
            onClick={() => setTicketModal(false) }>
              Close
          </Button>
          {nextOrCheckoutButton()} 
        </Box>
        {inputError === true 
          ? (<Alert severity="error">Error, make sure quanity for {inputErrorTic} are numbers before going to next page, if you do not want a ticket for a ticket type, input 0</Alert>) 
          : null}
        {exceedError === true 
          ? (<Alert severity="error">Error, quantity exceeded for {ticketTypeExceeded} is below the remaining ticket</Alert>) 
          : null}
        {duplicateError === true 
          ? (<Alert severity="error">Error, please make sure chosen seats are not the same seats for yor tickets</Alert>) 
          : null}
        {checkoutSuccess === true 
          ? (<Alert severity="success">you have successfully purchased your tickets, look out for a confirmation email</Alert>) 
          : null}
        {checkoutError === true 
          ? (<Alert severity="error">{checkoutErrorMsg}</Alert>) 
          : null}
        
      </Box>
    </Modal>

  );
};
export default PurchaseTicket;