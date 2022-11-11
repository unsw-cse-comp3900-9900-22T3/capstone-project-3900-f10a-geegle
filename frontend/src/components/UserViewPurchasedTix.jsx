import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

/**
 * Function that renders modal to view ticket purchases of a customer
 * for a specifield event
 * @param {*} param0 
 * @returns 
 */
const UserViewPurchasedTix = ({ 
  puchasedModal,
  setPuchasedModal,
  eventInfo
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    height: '50vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [purchasedTixs, setPurchasedTixs] = useState([]);

  const getPurchasedTixs = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/ticketsPurchased`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    const purchased = (await response.json()).tickets;
    setPurchasedTixs(purchased);
  }
    
  useEffect(()=> {
    getPurchasedTixs();
  },[])
  return (
    <Modal
      hideBackdrop
      open={puchasedModal}
      onClose={()=>setPuchasedModal(false)}
      aria-labelledby="view purchased tickets"
      aria-describedby="view purchased tickets"
    >
      <Box sx={style}>
        <Typography variant="h5" color="text.secondary">
          Your Purchased Tickets for {eventInfo.eventName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Ticket Type
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Price
            </Typography>
          </Grid>
          {eventInfo.seatedEvent === true ? (
            <>
              <Grid item xs={2}>
                <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
                  Seat Section
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
                  Seat 
                </Typography>
              </Grid>
            </>
          ): null}
          <Grid item xs={2}>
          </Grid>
        </Grid>
         {eventInfo.seatedEvent === true ? (
          <Box style={{overflow:'auto', height: '80%'}}>
            < Grid container spacing={1}>
              {(purchasedTixs).map((ticket, index) => {
                const SeatComponent = (()=> {
                  //console.log("in function function");
                  if(ticket.seat.seatRow !== null) {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        Row {ticket.seat.seatRow}, seat No. {ticket.seat.seatNo}
                      </Typography>
                    )
                  } else {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        seat No. {ticket.seat.seatNo}
                      </Typography>
                    )
                  }  
                })
                return (
                  <Grid container spacing = {1} style={{padding:'8px'}} key ={index}>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        {ticket.ticketType}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h6" color="text.secondary">
                        ${ticket.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h6" color="text.secondary">
                        {ticket.seat.seatSection}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <SeatComponent/>
                    </Grid>
                    <Grid item xs={2}>
                      <Button 
                        variant="contained"
                      >
                          Refund
                      </Button>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
          
         ) : (
          <Box style={{overflow:'auto', height: '80%'}}>
            < Grid container spacing={1}>
              {purchasedTixs.map((ticket, index) => {
                //console.log(seatComponent)
                return (
                  <Grid container spacing = {1} style={{padding:'8px'}} key ={index}>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        {ticket.ticketType}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        ${ticket.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button 
                        variant="contained"
                      >
                          Refund
                      </Button>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
         )}
        <Button 
            variant="text"
            onClick= {()=>setPuchasedModal(false)}
            >
              Close
        </Button>
        
      </Box>
    </Modal>
  )
}
export default UserViewPurchasedTix;