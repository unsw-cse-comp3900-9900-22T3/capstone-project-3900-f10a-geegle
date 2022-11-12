import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';


const EmailSuccessModal = ({
  setConfirmRefundPrompt,
  refundSuccess,
  setRefundSuccess,
  getPurchasedTixs,
  setPurchasedTixs
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
    p: 4,
  };
  useEffect(()=> {
    setConfirmRefundPrompt(false);
    getPurchasedTixs();
  })
  return (
    <Modal
    hideBackdrop
    open={refundSuccess}
    onClose={()=>setRefundSuccess(false)}
    aria-labelledby="confirm refund success modal"
  >
    <Box sx={style}>
      <Typography variant="h6" style={{color: 'green'}}>
        You have successfully refunded your ticket, you will recieve a confirmation email shortly
      </Typography>
      <Button 
          variant="text"
          onClick = {()=>setRefundSuccess(false)}
          >
            Close
      </Button>
    </Box>
  </Modal>
)
}

const ConfirmRefundModal = ({
  confirmRefundPrompt,
  setConfirmRefundPrompt,
  ticketInfo,
  eventInfo,
  getPurchasedTixs,
  setPurchasedTixs
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
    p: 4,
  };
  // const email refund confirmation
  // const submitRefund
  const [refundSuccess, setRefundSuccess] = useState(false);
  const submitRefund = async() => {
    const response = await fetch(`http://localhost:3000/events/cancelBooking/${ticketInfo.ticketID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    if (response.ok) {
      const responseEmail = await fetch(`http://localhost:3000/events/emailCancelBooking/${ticketInfo.ticketID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      })
    }
    setRefundSuccess(true);
  }
  return (
    <Modal
      hideBackdrop
      open={confirmRefundPrompt}
      onClose={()=>setConfirmRefundPrompt(false)}
      aria-labelledby="confirm email success modal"
    >
      <Box sx={style}>
        <Box id="content container" style={{width: "50vw", height: '40vh', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap:"3rem"}}>
          <Typography variant="h4">
            Are you sure you want to refund your ticket?
          </Typography>
          <Box id= "buttons">
            <Button 
                style={{marginRight: "15px",width: "8rem", fontSize: "1.3rem", backgroundColor: "green"}}
                variant="contained"
                size="large"
                onClick = {()=>submitRefund()}
                >
                  Yes
            </Button>
            <Button 
                style={{width: "8rem", fontSize: "1.3rem"}}
                variant="contained"
                onClick = {()=>setConfirmRefundPrompt(false)}
                size="large"
                >
                  No
            </Button>
          </Box>
          {refundSuccess === true ? (
          <EmailSuccessModal
            setConfirmRefundPrompt = {setConfirmRefundPrompt}
            refundSuccess = {refundSuccess}
            setRefundSuccess = {setRefundSuccess}
            getPurchasedTixs = {getPurchasedTixs}
            setPurchasedTixs = {setPurchasedTixs}
            />
        ): null}
        </Box>
      </Box>
    </Modal>
  )
}

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
  const [confirmRefundPrompt, setConfirmRefundPrompt] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});

  const getPurchasedTixs = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/ticketsPurchased`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    if (response.ok) {
      const purchased = (await response.json()).tickets;
      console.log(purchased);
      setPurchasedTixs(purchased);
    }
    
  }
  const handleRefundPrompt = (ticket) => {
    setTicketInfo({...ticket});
    setConfirmRefundPrompt(true);
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
                  if(ticket.seatRow !== null) {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        Row {ticket.seatRow}, seat No. {ticket.seatNo}
                      </Typography>
                    )
                  } else {
                    return (
                      <Typography variant="h6" color="text.secondary">
                        seat No. {ticket.seatNo}
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
                        {ticket.seatSection}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <SeatComponent/>
                    </Grid>
                    <Grid item xs={2}>
                      <Button 
                        variant="contained"
                        onClick = {()=>handleRefundPrompt(ticket)}
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
                        onClick ={()=>handleRefundPrompt(ticket)}
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
        { confirmRefundPrompt === true ? (
          <ConfirmRefundModal
          confirmRefundPrompt = {confirmRefundPrompt}
          setConfirmRefundPrompt = {setConfirmRefundPrompt}
          ticketInfo = {ticketInfo}
          eventInfo= {eventInfo} 
          getPurchasedTixs = {getPurchasedTixs}
          setPurchasedTixs = {setPurchasedTixs}/>
        ): null}
      </Box>
    </Modal>
  )
}
export default UserViewPurchasedTix;