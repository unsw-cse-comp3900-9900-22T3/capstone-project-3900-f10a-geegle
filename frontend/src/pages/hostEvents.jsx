import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl, Modal, Grid } from '@mui/material';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import ViewCustomers from '../components/ViewCustomers';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };


  const CancelSuccessModal = ({
    unpublishSuccess,
    setUnpublishSuccess,
    eventInfo,
    closeConfirmModal
  
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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '16px',
      alignItems: 'center',
      p: 4,
    };
  
    const handleSuccessClose = () => {
      setUnpublishSuccess(false);
      closeConfirmModal();
    }
  
    return (
      <Modal
        hideBackdrop
        open={unpublishSuccess}
        onClose={()=>setUnpublishSuccess(false)}
        aria-labelledby="confirm email success modal"
      >
        <Box sx={style}>
          <Typography variant="h5" style={{color: 'green'}}>
            You have successfully cancelled event "{eventInfo.eventName}". A cancellation email and refund has been sent to customers.
          </Typography>
          <Button 
              variant="text"
              size="large"
              style={{fontSize:'1.07rem'}}
              onClick = {()=>handleSuccessClose()}
              >
                Close
          </Button>
        </Box>
      </Modal>
      
    )
  }


const ConfirmUnpublishModal = ({
  confirmUnpubPrompt,
  setConfirmUnpubPrompt,
  eventInfo,
  fetchHostEvents,
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '45vh',
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
  const [unpublishSuccess, setUnpublishSuccess] = React.useState(false);
  const closeConfirmModal = () => {
    setConfirmUnpubPrompt(false);
  }

  const handleUnpublish = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/cancel`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token'),
      },
    });

   
    if (response.ok) {
      setUnpublishSuccess(true);
      const guestList = ((await response.json()).events).guests;
      const guestObj = JSON.stringify({
        guests: guestList
      });
      const responseEmail = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/emailUnpublish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: guestObj
      })
      fetchHostEvents();
    };
  }
  return (
    <Modal
      hideBackdrop
      open={confirmUnpubPrompt}
      onClose={()=> setConfirmUnpubPrompt(false)}
      aria-labelledby="confirm email success modal"
    >
      <Box sx={style}>
        <Box id="content container" style={{width: "50vw", height: '40vh', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap:"3rem"}}>
          <Card style={{padding: '20px', height:'40%', width: '80%', overflow: 'auto'}}>
            <Typography  variant="h4" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Event Name: {eventInfo.eventName}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Event Start Date and Time: {(new Date(eventInfo.startDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Event End Date and Time: {(new Date(eventInfo.endDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Venue: {eventInfo.eventVenue}, Location: {eventInfo.eventLocation}
            </Typography>
          </Card>
          <Typography variant="h5">
            Are you sure you want cancel {eventInfo.eventName}? By cancelling the event you are unpublishing the event from being "live" to customers. Refunds and cancellation notices will be sent to all customers when the event is cancelled
          </Typography>
          <Box id= "buttons">
            <Button 
                style={{marginRight: "15px",width: "8rem", fontSize: "1.3rem", backgroundColor: "green"}}
                variant="contained"
                size="large"
                onClick = {()=>handleUnpublish()}
                >
                  Yes
            </Button>
            <Button 
                style={{width: "8rem", fontSize: "1.3rem"}}
                variant="contained"
                onClick = {()=> setConfirmUnpubPrompt(false)}
                size="large"
                >
                  No
            </Button>
          </Box>
          {unpublishSuccess === true ? (
          <CancelSuccessModal
            unpublishSuccess = {unpublishSuccess}
            setUnpublishSuccess = {setUnpublishSuccess}
            eventInfo = {eventInfo}
            closeConfirmModal = {closeConfirmModal}
            />
        ): null}
        </Box>
      </Box>
    </Modal>
  )
}
const DeleteSuccessModal = ({
  delSuccess,
  setDelSuccess,
  eventInfo,
  closeDeleteConfirmModal

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
    alignItems: 'center',
    p: 4,
  };

  const handleSuccessClose = () => {
    setDelSuccess(false);
    closeDeleteConfirmModal();
  }

  return (
    <Modal
      hideBackdrop
      open={delSuccess}
      onClose={()=>setDelSuccess(false)}
      aria-labelledby="confirm email success modal"
    >
      <Box sx={style}>
        <Typography variant="h5" style={{color: 'green'}}>
          You have successfully delted the event "{eventInfo.eventName}".
        </Typography>
        <Button 
            variant="text"
            size="large"
            style={{fontSize:'1.07rem'}}
            onClick = {()=>handleSuccessClose()}
            >
              Close
        </Button>
      </Box>
    </Modal>
    
  )
}
const ConfirmDeleteModal = ({
  deletePrompt,
  setDeletePrompt,
  eventInfo,
  fetchHostEvents,
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '45vh',
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
  const [delSuccess, setDelSuccess] = React.useState(false);
  const closeDeleteConfirmModal = () => {
    setDeletePrompt(false);
  }

  const handleDelete = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/delete`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token'),
      },
    });

    
    if (response.ok) {
      setDelSuccess(true);
      fetchHostEvents();
    };
  }
  return (
    <Modal
      hideBackdrop
      open={deletePrompt}
      onClose={()=> setDeletePrompt(false)}
      aria-labelledby="confirm delete modal"
    >
      <Box sx={style}>
        <Box id="content container" style={{width: "50vw", height: '40vh', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap:"3rem"}}>
          <Card style={{padding: '20px', height:'40%', width: '80%', overflow: 'auto'}}>
            <Typography  variant="h4" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Event Name: {eventInfo.eventName}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Event Start Date and Time: {(new Date(eventInfo.startDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Event End Date and Time: {(new Date(eventInfo.endDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{lineHeight: "1.2"}}>
              Venue: {eventInfo.eventVenue}, Location: {eventInfo.eventLocation}
            </Typography>
          </Card>
          <Typography variant="h5">
            Are you sure you want deleting {eventInfo.eventName}? By deleting the event you are permanantly deleting all information about this event on eventful systems
          </Typography>
          <Box id= "buttons">
            <Button 
                style={{marginRight: "15px",width: "8rem", fontSize: "1.3rem", backgroundColor: "green"}}
                variant="contained"
                size="large"
                onClick = {()=>handleDelete()}
                >
                  Yes
            </Button>
            <Button 
                style={{width: "8rem", fontSize: "1.3rem"}}
                variant="contained"
                onClick = {()=> setDeletePrompt(false)}
                size="large"
                >
                  No
            </Button>
          </Box>
          {delSuccess === true ? (
          <DeleteSuccessModal
            delSuccess= {delSuccess}
            setDelSuccess ={setDelSuccess}
            eventInfo = {eventInfo}
            closeDeleteConfirmModal = {closeDeleteConfirmModal}
            />
        ): null}
        </Box>
      </Box>
    </Modal>
  )
}
const HostEventsPage = () => {
  const [myListings, setMyListings] = React.useState([]);
  const [customerModal, setCustomerModal] = React.useState(false);
  const [clickedEventInfo, setClickedEventInfo] = React.useState({});
  const [confirmUnpubPrompt, setConfirmUnpubPrompt] = React.useState(false);
  const [clickedEventUnpublished, setClickedEventUnpublished] = React.useState({});
  const [clickedDeletedEvent, setClickedDeletedEvent] = React.useState({});
  const [deletePrompt, setDeletePrompt] = React.useState({});
  const handleViewCustomers = (eventInfo) => {
    setCustomerModal(true);
    setClickedEventInfo({...eventInfo});
  }

  const handlePublish = async(obj, idx) => {
    const response = await fetch(`http://localhost:3000/events/${obj.eventID}/publish`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token'),
      },
    });
    if (response.ok) {
      console.log('published!')
      fetchHostEvents();
    };

  }

  const openDeletePrompt = async(obj,idx) => {
    setClickedDeletedEvent(obj);
    setDeletePrompt(true);
  }
  const openConfirmModal = async(obj, idx) => {
    setClickedEventUnpublished(obj);
    setConfirmUnpubPrompt(true);
  }

  const fetchHostEvents = async () => {
    if (localStorage.getItem('token')) {
      const response = await fetch(`http://localhost:3000/events/host`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      console.log('host payload', json);
      setMyListings(json.events)
    }
  }

  React.useEffect(() => {
    // fetch bookings if token is available
    fetchHostEvents();
  }, []);
  
  return (
    <Grid container spacing={1} style={{padding: "3.2rem"}}>  
      <Grid item xs={12}>
        <Typography variant="h5"  color="text.secondary" style={{textAlign:"center"}}>
          Your Events that you are Hosting
        </Typography>
      </Grid>
      <Grid item xs= {12}>
        <Grid container spacing ={6}>
          {myListings.map((obj, idx) => {
          return (
            <Grid container item xs={12} >
              <Card key={idx} style={{display: 'flex', width: '100%', height:'20rem'}} >
                <Box id="card media" width = "40%" >
                  <CardMedia
                      component="img"
                      height="100%"
                      image={obj.image1}
                      alt="event thumbnail"
                      style={{overflow:"auto"}}
                  />
                </Box>
                <Box id="card contend and action container" style={{display:'flex', flexDirection: 'column', width:'60%'}}>
                  <Box id="card content" style={{height:'90%', overflow:'auto'}}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {obj.eventName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {obj.eventType +' | '+ obj.eventVenue+' | '+obj.capacity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`Description:  ${obj.eventDescription}`}
                      </Typography>
                      {Array(Math.ceil(obj.averageRating))
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            height="35"
                            width="35"
                            aria-label="coloured star rating"
                          >
                            <polygon
                              points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                              fill="#ffd800"
                            />
                          </svg>
                        ))}
                      {Array(5 - Math.ceil(obj.averageRating))
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            height="35"
                            width="35"
                            aria-label="uncoloured star rating"
                          >
                            <polygon
                              points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                              fill="#7e7e7e"
                              stroke="#7e7e7e"
                              strokeWidth="1"
                            />
                          </svg>
                        ))}
                      <Typography variant="body2" color="text.secondary">
                        Average Rating: {obj.averageRating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reviews: {(obj.reviews).length}
                      </Typography>
                    </CardContent>
                  </Box>
                  <Box id= "card actions">
                    <CardActions>
                      <Button 
                        component={Link}
                        to= {{pathname: `/event/view/${obj.eventID}`}}
                        state= {obj}
                        size="small">
                          view
                      </Button>
                      {obj.published && <Button size="small" onClick={()=>handleViewCustomers(obj)}>Customers</Button>}
                      {obj.published && <Button size="small" onClick={()=>openConfirmModal(obj, idx)}>Cancel</Button>}
                      {!obj.published && <Button size="small" onClick={e=>handlePublish(obj, idx)}>publish</Button>}
                      <Button 
                        component={Link}
                        to= {{pathname: `/events/${obj.eventID}/dashboard`}}
                        state= {obj}
                        size="small">
                          Dashboard
                      </Button>
                      {!obj.published && <Button size="small" onClick={e=>handlePublish(obj, idx)}>Publish</Button>}
                      {!obj.published && <Button size="small" onClick={()=>openDeletePrompt(obj,idx)}>Delete</Button>}
                    </CardActions>
                  </Box>
                </Box>
              </Card> 
            </Grid>
            )
          })}
        </Grid>
      </Grid>
    
      {customerModal === true ? (<ViewCustomers 
        customerModal={customerModal}
        clickedEventInfo = {clickedEventInfo}
        setCustomerModal = {setCustomerModal}/>) : null}

      {confirmUnpubPrompt === true ? (<ConfirmUnpublishModal
        confirmUnpubPrompt = {confirmUnpubPrompt}
        setConfirmUnpubPrompt = {setConfirmUnpubPrompt}
        eventInfo = {clickedEventUnpublished}
        fetchHostEvents= {fetchHostEvents}/>) : null}

      {deletePrompt === true ? (<ConfirmDeleteModal
        deletePrompt ={deletePrompt}
        setDeletePrompt ={setDeletePrompt}
        eventInfo = {clickedDeletedEvent}
        fetchHostEvents= {fetchHostEvents}/>) : null}
        
    </Grid>
  );
};
export default HostEventsPage;