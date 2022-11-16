import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { FormControl,Box, TextField, FormLabel, RadioGroup, Radio, FormControlLabel, Alert } from '@mui/material';


/**
 *  This functional component renders the payment details form 
 *  when user purchases a ticket. The user can specify whether they want
 *  to used their saved credit card or a new credit card to pay for their ticket
 */
const PaymentConfirmation= ({
  paymentOption,
  setPaymentOption,
  setNewCreditCardNum,
  setNewCCV,
  setNewMonth,
  setNewYear,
  hasSeats,
  quantity,
  availTicketTypes,
  setChosenSeats
  }) => {
  
  const [creditCardNum, setCreditCardNum] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [noSavedPayment, setNoSavedPayment] = useState(false);


  const handlePaymentChange = (event) => {
    setPaymentOption(event.target.value);
  }

  const fetchCardDetails = async () => {
    if (localStorage.getItem('token')) {
      const response = await fetch(`http://localhost:3000/user/profile/${localStorage.getItem('userId')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      
      if (json.user.creditCard !== undefined) {
        const unencryptedNum = json.user.creditCard.creditCardNum;
        const encryptedNum = `xxxxxxxxxxxx${unencryptedNum.substr(unencryptedNum.length-4)}`
        setCreditCardNum(encryptedNum);
        setMonth(json.user.creditCard.expiryMonth);
        setYear(json.user.creditCard.expiryYear);
        setNoSavedPayment(false);
      } else {
        setNoSavedPayment(true);
      }
      
    }
  }

  /**
   *  This useEffect is used to check whether user came from a seat selection page or from 
   *  the initial ticket selection page. If user came from the initial ticket selection page
   *  then chosenSeatsArray needs to populated.
   */
  useEffect(()=> {
    fetchCardDetails();
    if (hasSeats === false) {
      // initialise chosenSeats array
      let chosenSeatsArray = [];
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
      setChosenSeats(chosenSeatsArray);
    }
  },[])
  return (   
    <Box sx={{p:2}}>
      <Typography aria-label="Payment Option Title" variant="h4" width="100%">Payment Options</Typography>
      <FormControl >
        <Typography aria-label="Payment Option subheading" variant="h5" sx={{mt: 2}}>Pay With</Typography>
        <FormControl>
          <FormLabel id="payment-controlled-radio-buttons-group">Available Payment options</FormLabel>
          <RadioGroup
            aria-labelledby="payment-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={paymentOption}
            onChange={(event)=>handlePaymentChange(event)}
          >
            <FormControlLabel value="stored" control={<Radio />} label="Use Saved Payment details" />
            <FormControlLabel value="notStored" control={<Radio />} label="Use New Payment Details " />
          </RadioGroup>
        </FormControl>
        {paymentOption === "notStored"? (
          <Box>
            <FormControl>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Credit card Number:
              </Typography>
              <TextField
                required
                id="editNumber"
                placeholder="xxxxxxxxxxxxxxxx"
                onChange={e => setNewCreditCardNum(e.target.value)}
                type='text'
              />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                CCV:
              </Typography>
              <TextField
                  required
                  id="editCCV"
                  placeholder="xxx"
                  onChange={e => setNewCCV(e.target.value)}
                  type='text' 
              />
              <Typography id="modal-modal-title" variant="h6" component="h2">
              Expiry Month:
              </Typography>
              <TextField
                  required
                  id="editMonth"
                  placeholder="mm"
                  onChange={e => setNewMonth(e.target.value)}
                  type='text'  
              />
              <Typography id="modal-modal-title" variant="h6" component="h2">
              Expiry Year:
              </Typography>
              <TextField
                  required
                  id="editYear"
                  placeholder="yy"
                  onChange={e => setNewYear(e.target.value)}
                  type='text'  
              />
            </FormControl>
          </Box>
        ): null}
        {paymentOption === "stored"? (
          <Box>
            <FormControl>
              <Typography variant="h5" sx={{ mt: 2 }}>
                Your saved credit card details
              </Typography>
              <Typography id="saved credit card" sx={{ mt: 2 }}>
                Credit card Number: {creditCardNum}
              </Typography>
              <Typography id="saved expiry month" sx={{ mt: 2 }}>
                Expiry Month: {month}
              </Typography>
              <Typography id="saved expiry month" sx={{ mt: 2 }}>
                Expiry Year: {year}
              </Typography>
            </FormControl>
          </Box>
        ): null}
        {(paymentOption === "stored" && noSavedPayment === true)?(
          (<Alert severity="warning">you have no saved card, please use new payment</Alert>)
        )
        :null}
      </FormControl>
    </Box>
  );
};
export default PaymentConfirmation;