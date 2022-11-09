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
const CustomerTickets = ({
  customerTicketInfo, 
  setViewTicketModal,
  viewTicketModal,
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
  // console.log('in function');
  console.log('customer ticket info',  customerTicketInfo);
  console.log('eventInfo',  eventInfo);
  return (
    <Modal
      hideBackdrop
      open={viewTicketModal}
      onClose={()=>setViewTicketModal(false)}
      aria-labelledby="view customer tickets"
      aria-describedby="view customer tickets"
    >
      <Box sx={style}>
        <Typography variant="h5" color="text.secondary">
          Tickets purchased by {customerTicketInfo.name} for {eventInfo.eventName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Ticket Type
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Price
            </Typography>
          </Grid>
          {eventInfo.seatedEvent === true ? (
            <>
              <Grid item xs={3}>
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
          
        </Grid>
         {eventInfo.seatedEvent === true ? (
          <Box style={{overflow:'auto', height: '80%'}}>
            < Grid container spacing={1}>
              {(customerTicketInfo.tickets).map((c, index) => {
                console.log('c', c);
                const SeatComponent = (()=> {
                  //console.log("in function function");
                  if(c.seat.seatRow !== null) {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        Row {c.seat.seatRow}, seat No. {c.seat.seatNo}
                      </Typography>
                    )
                  } else {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        seat No. {c.seat.seatNo}
                      </Typography>
                    )
                  }  
                })
                //console.log(seatComponent)
                return (
                  <Grid container spacing = {1} style={{padding:'8px'}} key ={index}>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        {c.ticketType}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        ${c.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        {c.seat.seatSection}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <SeatComponent/>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
          
         ) : (
          <Box style={{overflow:'auto', height: '80%'}}>
            < Grid container spacing={1}>
              {(customerTicketInfo.tickets).map((c, index) => {
                //console.log(seatComponent)
                return (
                  <Grid container spacing = {1} style={{padding:'8px'}} key ={index}>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        {c.ticketType}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h6" color="text.secondary">
                        ${c.price}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
         )}
        <Button 
            variant="text"
            onClick= {()=>setViewTicketModal(false)}
            >
              Close
        </Button>
        
      </Box>
    </Modal>
  )
}
export default CustomerTickets;