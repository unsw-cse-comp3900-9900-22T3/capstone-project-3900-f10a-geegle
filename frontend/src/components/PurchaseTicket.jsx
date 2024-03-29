/* eslint-disable */ 
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useNavigate} from 'react-router-dom';
import TicketTypeCard from '../components/TicketTypeCard';
import SeatAllocation from '../components/SeatAllocation';
import PaymentConfirmation from '../components/PaymentConfirmation';

/**
 * Functional component for when checkout was successful 
 */
const PurchaseSuccessModal = ({
  setCheckoutSuccess,
  checkoutSuccess,
  closeTicketModal,
  getEventInfo
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '40vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
    alignItems: 'center',
    p: 4,
  };

  const handleClose = () => {
    closeTicketModal();
    setCheckoutSuccess(false);
    getEventInfo();
  }
  return (
    <Modal
    hideBackdrop
    open={checkoutSuccess}
    onClose={()=>setCheckoutSuccess(false)}
    aria-labelledby="confirm refund success modal"
  >
    <Box sx={style}>
      <Typography variant="h5" style={{color: 'green'}}>
        Your Purchase was successful, you will recieve a confirmation email with your order summary shortly.
      </Typography>
      <Button 
          variant="text"
          size="large"
          style={{fontSize:'1.07rem'}}
          onClick = {()=>handleClose()}
          >
            Close
      </Button>
    </Box>
  </Modal>
)
}
/**
 *  This functional component controls the ticket purchasing form when the user clicks
 *  "buy" ticket on the view event page. The pages are
 *  1. selected ticket type 
 *  2. seat allocation if seats are available 
 *  3. payment details and confirmation 
 * 
 */
const PurchaseTicket= ({
  getEventInfo,
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
  const [decimalError, setDecimalError] = useState(false);
  const [negError, setNegError] = useState(false);
  const [exceedError, setExceedError] = useState(false);
  const [ticketTypeExceeded, setTicketTypeExceeded] = useState("");
  const [hasSeats, setHasSeats] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const navigate = useNavigate();


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
  const [emptySeats, setEmptySeats] = useState(false);
  
  // payment confirmation page variables (page 3)
  const [paymentOption, setPaymentOption] = useState("stored");
  const [newCreditCardNum, setNewCreditCardNum] = useState('');
  const [newCCV, setNewCCV] = useState('');
  const [newMonth, setNewMonth] = useState('');
  const [newYear, setNewYear] = useState('');
  

  // closing this component
  const closeTicketModal = () => {
    setTicketModal(false);
  }

  /**
   * handleNextPage error checks the current page before
   * going to the next page
   */
  const handleNextPage = () => {
    // check for errors before processing to the next page

    if (currentPage === 1) {
      // reset the error states
      setInputError(false);
      setExceedError(false);
      setDecimalError(false);
      setNegError(false);
      // check if there is a decimal 
      if (quantity.some((val)=> val % 1 !== 0)) {
        setDecimalError(true)
        return;
      }

      // numbers cannot be negative
      if (quantity.some((val)=> val < 0)) {
        setNegError(true)
        return;
      }

      // check if at least one ticket is selected (use Input error)
      if (quantity.every((val)=> val === 0)) {
        setInputError(true);
        return;
      }

      // check for quantity exceeding the remaining ticket
      let idx = 0;
      for (const qty of quantity) {
        if (parseInt(qty) > parseInt(availTicketTypes[idx].remaining)) {
          setExceedError(true);
          setTicketTypeExceeded(availTicketTypes[idx].ticketType);
          return;
        }
        idx++;
      }
      // when there are no errors then we allow the user to go to the 
      // go to page 2 for seat allocations if event is seated
      // go to page 3 for payment details if event is not seated
      if (hasSeats === true) {
        setCurrentPage(2);
      } else {
        // go to payment page
        setCurrentPage(3)
      }
    } else if (currentPage === 2) {
      // reset error states for seat allocations
      setDuplicateError(false);
      setEmptySeats(false);

      // pass chosen seatId into an array
      const seatIdChosen = chosenSeats.map((seat,index) => {
        return seat.seatId;
      })

      // check if seats are selected for all tickets
      const checkEmpty = seatIdChosen.some((seat,index)=> seat === "")
      if (checkEmpty === true) {
        setEmptySeats(true);
        return;
      }

      // check if no two seats are the same
      const duplicate = seatIdChosen.some((seat,index)=> seatIdChosen.indexOf(seat) !== index)
      if (duplicate === true) {
        setDuplicateError(true);
        return;
      }

       // no error, allow user to move to the next page
      setCurrentPage(3);
     
    }
  }

  /**
   *  functional that actiavtes when checkout button is clciked. The button only
   *  appears on the payment confirmation page.
   */
  const handleCheckout = async(event, index) => {

    // converting chosenSeats keys into 3 arrays
    setCheckoutSuccess(false);
    setCheckoutError(false);
    const tickets = chosenSeats.map((obj, index)=> obj.ticketType);
    const section = chosenSeats.map((obj, index)=> obj.section);
    let seatId = chosenSeats.map((obj, index)=> obj.seatId); 
    let jsonString = "";
    if(hasSeats === false) {
      seatId = [];
    }

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
      const bookingInfo = (await r.json()).booking;
      const bookingJsonStr = JSON.stringify({
        booking: bookingInfo
      });
      const responseEmail = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/emailPurchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: bookingJsonStr
      })
    } else {
      setCheckoutError(true);
      
    }
  }

  /**
   *  Function that handles when user selects new quantities on page 1 (ticket selection)
   */
  const handleQuantity = (event, index) => {
    let newQty = 0;
    if (event.target.value !== "") {
      newQty = parseFloat(event.target.value);
    }
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

  // get available ticket types to show on page 1 (ticket selection) for the user
  // if ticket type is sold out, it will not show
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
      const numOfAvailTypes = (ticketData.tickets).length;
      let tempArray = [];
      for (let i = 0; i<numOfAvailTypes; i++) {
        tempArray.push(0);
      }
      setQuantity([...tempArray]);
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

  // Function that renders which page to navigate the user
  const pageControl = () => {
    if (currentPage === 1) {
      return (
        <>
          <Box id="ticket container" sx ={{mt:'1.5vw'}}>
            <Box id="ticket heading title">
              <Typography aria-label="ticket page title" variant="h5" width="100%">Tickets Available for purchase</Typography>
            </Box>
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

  return (
    <Modal
      open={ticketModal}
      onClose={() => setTicketModal(false) }
      aria-labelledby="ticket modal"
      aria-describedby="purchasing ticket form"
    >
      <Box sx={style}>
        <Box id="header container" style={{backgroundColor:"#8666e7", padding:"10px"}}>
          <Typography aria-label="event name" style={{color:"white"}} variant="h6" >
            {eventInfo.eventName}
          </Typography>
          <Typography aria-label="event location" style={{color:"white"}} id="modal-modal-description">
            {`Location ${eventInfo.eventVenue}, ${eventInfo.eventLocation}`}
          </Typography>
          <Typography aria-label="event dates" style={{color:"white"}} id="modal-modal-description">
            {`Date: ${(new Date(eventInfo.startDateTime)).toLocaleString('en-AU',dateOptions)} to ${(new Date(eventInfo.endDateTime)).toLocaleString('en-AU',dateOptions)}`}
          </Typography>
        </Box>
        
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
          ? (<Alert severity="error">Error, please select at least 1 ticket</Alert>) 
          : null}
        {exceedError === true 
          ? (<Alert severity="error">Error, quantity exceeded for {ticketTypeExceeded} is below the remaining ticket</Alert>) 
          : null}
        {emptySeats === true 
          ? (<Alert severity="error">Error, you have not chosen a seat for your ticket/tickets, please check</Alert>) 
          : null}
        {duplicateError === true 
          ? (<Alert severity="error">Error, please make sure chosen seats are not the same seats for your tickets</Alert>) 
          : null}
       {decimalError === true 
          ? (<Alert severity="error">Quanities must be whole numbers</Alert>) 
          : null} 
        {negError === true 
          ? (<Alert severity="error">Quanities must be positive numbers</Alert>) 
          : null} 
        {checkoutError === true 
          ? (<Alert severity="error">Invalid credit card details, please check credit card details are correct. Make sure Credit Card Number is 16 digits, CVV is 3 digits, month is in the form of mm and year is in the form of yy</Alert>) 
          : null}
        {checkoutSuccess === true 
          ? (
            <PurchaseSuccessModal 
              setCheckoutSuccess = {setCheckoutSuccess}
              checkoutSuccess = {checkoutSuccess}
              closeTicketModal = {closeTicketModal}
              getEventInfo = {getEventInfo}/>
          ) 
          : null} 
        
      </Box>
    </Modal>

  );
};
export default PurchaseTicket;