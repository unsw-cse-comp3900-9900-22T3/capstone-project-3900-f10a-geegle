/* eslint-disable */ 
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Alert, Card } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';


/**
 *  Component that displays a successful refund message when customer has
 *  successfully refunded their ticket.
 */
const EmailSuccessModal = ({
  setConfirmRefundPrompt,
  refundSuccess,
  setRefundSuccess,
  getPurchasedTixs,
  setPurchasedTixs,
  closeConfirmModal
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
    closeConfirmModal();
    setRefundSuccess(false);
    getPurchasedTixs();
  }
  
  return (
    <Modal
    hideBackdrop
    open={refundSuccess}
    onClose={()=>setRefundSuccess(false)}
    aria-labelledby="confirm refund success modal"
  >
    <Box sx={style}>
      <Typography variant="h5" style={{color: 'green'}}>
        You have successfully refunded your ticket, you will recieve a confirmation email shortly.
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
 * Component to confirm do they actually want to refund their ticket
 * customers can only refund their tickets at least 7 days before their event
 */
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
  
  const [refundSuccess, setRefundSuccess] = useState(false);
  const closeConfirmModal = () => {
    setConfirmRefundPrompt(false);
  }
  const submitRefund = async() => {
    const response = await fetch(`http://localhost:3000/events/cancelBooking/${ticketInfo.ticketID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    if (response.ok) {
      setRefundSuccess(true);
      const responseEmail = await fetch(`http://localhost:3000/events/emailCancelBooking/${ticketInfo.ticketID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      })
    }
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
            closeConfirmModal = {closeConfirmModal}
            />
        ): null}
        </Box>
      </Box>
    </Modal>
  )
}

/**
 * Function that renders modal to view ticket purchases of the user
 * for a specifield event
 */
const UserViewPurchasedTix = (
 ) => {
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
  const dateOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  }
  const [purchasedTixs, setPurchasedTixs] = useState([]);
  const [confirmRefundPrompt, setConfirmRefundPrompt] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  const [purchasedModal, setPurchasedModal] = useState(true);
  const [eventInfo, setEventInfo] = useState({});
  const { eventId} = useParams();
  const [lateRefundError, setLateRefundError] = useState(false)
  const [sevenDaysBeforeStart, setSevenDaysBeforeStart] = useState(new Date())
  const navigate = useNavigate();
  const getEventInfo = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/info`, {
      method: 'GET'
    })
    const eventJson = (await response.json()).event;
    const eventDetails = {
      venueCapacity: eventJson.venueCapacity,
      capacity: eventJson.capacity,
      endDateTime: eventJson.endDateTime,
      eventDescription: eventJson.eventDescription,
      eventID: eventJson.eventID,
      eventLocation: eventJson.eventLocation,
      eventName: eventJson.eventName,
      eventType: eventJson.eventType,
      eventVenue: eventJson.eventVenue,
      eventVenueId: eventJson.eventVenueId,
      hostEmail: eventJson.hostEmail,
      seatedEvent: eventJson.seatedEvent,
      hostID: eventJson.hostID,
      hostName: eventJson.hostName,
      image1: eventJson.image1,
      image2: eventJson.image2,
      image3: eventJson.image3,
      published: eventJson.published,
      startDateTime: eventJson.startDateTime,
      totalTicketAmount:eventJson.totalTicketAmount,
    }
    const startDate = new Date(eventDetails.startDateTime);
    const startDateInMs = startDate.getTime();
    setSevenDaysBeforeStart(new Date(startDateInMs - 7 * 24 * 60 * 60 * 1000));
    setEventInfo({...eventDetails});
    return eventDetails;
      
  }
  const getPurchasedTixs = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/ticketsPurchased`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    if (response.ok) {
      const purchased = (await response.json()).tickets;
      setPurchasedTixs(purchased);
    }
    
  }
  const handleRefundPrompt = (ticket) => {
    setLateRefundError(false);
    setTicketInfo({...ticket});
    const startDate = new Date(eventInfo.startDateTime);
    const startDateInMs = startDate.getTime();
    const sevenDaysBeforeStart = new Date(startDateInMs - 7 * 24 * 60 * 60 * 1000); //in milliseconds
    const currDate = new Date();
    if (currDate<= sevenDaysBeforeStart) {
      setConfirmRefundPrompt(true);
    } else {
      setConfirmRefundPrompt(false);
      setLateRefundError(true);

    }  
  }

  const closeTicketView = () => {
    setPurchasedModal(false);
    navigate(`/events/myEvent`);
  }
  useEffect(()=> {
    getEventInfo();
    getPurchasedTixs();
  },[])
  return (
    <Modal
      open={purchasedModal}
      onClose={closeTicketView}
      aria-labelledby="view purchased tickets"
    >
      <Box sx={style}>
        <Typography variant="h5" color="text.secondary">
          Your Purchased Tickets for {eventInfo.eventName}
        </Typography>
        <Card style={{padding: '20px', height:"20%", overflow:"auto"}}>
          <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
            Event Start Date and Time: {(new Date(eventInfo.startDateTime)).toLocaleString("en-AU",dateOptions)}
          </Typography>
          <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
            Event End Date and Time: {(new Date(eventInfo.endDateTime)).toLocaleString("en-AU",dateOptions)}
          </Typography>
          <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
            Refunds can only be made if it is at least 7 days before your event, which is before {sevenDaysBeforeStart.toLocaleString("en-AU",dateOptions)}
          </Typography>
        </Card>
        <Grid container spacing={3} sx={{marginTop: "8px"}}>
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
          <Box style={{overflow:'auto', height: '40%'}}>
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
          <Box style={{overflow:'auto', height: '40%'}}>
            < Grid container spacing={1}>
              {purchasedTixs.map((ticket, index) => {
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
            onClick= {()=>closeTicketView()}
            >
              Close
        </Button>
        {lateRefundError === true ? (
          <Alert severity="error">Refunds can only be processed if it is at least 7 days before the event</Alert>
         ) : null}
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