import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid, Modal } from '@mui/material';
import Stack from '@mui/material/Stack';
import { GifBoxOutlined } from '@mui/icons-material';
import ViewReviews from './viewReviews';
import PurchaseTicket from '../components/PurchaseTicket';

const LogInPurchaseModal=(
  {
    logInPrompt,
    setLogInPrompt
  }
) => {
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
  return (
    <Modal
    hideBackdrop
    open={logInPrompt}
    onClose={()=>setLogInPrompt(false)}
    aria-labelledby="log in to purchase modal"
  >
    <Box sx={style}>
      <Box id="content container" style={{width: "50vw", height: '40vh', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap:"3rem"}}>
        <Typography variant="h4">
          Please login/register to purchase tickets
        </Typography>
        <Box id= "buttons">
          <Button 
              style={{marginRight: "15px",width: "8rem", fontSize: "1.3rem", backgroundColor: "#9579e7"}}
              variant="contained"
              size="large"
              component={Link}
              to={{pathname: `/login`}}
              >
                login
          </Button>
          <Button 
              style={{marginRight: "15px", width: "8rem", fontSize: "1.3rem", backgroundColor: "#9579e7"}}
              variant="contained"
              size="large"
              component={Link}
              to={{pathname: `/register`}}
              >
                register
          </Button>
          <Button 
              style={{width: "8rem", fontSize: "1.3rem"}}
              variant="contained"
              onClick = {()=>setLogInPrompt(false)}
              size="large"
              >
                close
          </Button>
        </Box>
      </Box>
    </Box>
  </Modal>
  )
}

const ViewEvent= () => {
  const { eventId} = useParams();
  const state = useLocation();
  const eventObj = state.state;
  console.log(eventObj);
  const [eventInfo, setEventInfo] = useState({
    capacity: '',
    endDateTime: '',
    eventDescription: '',
    eventID: '',
    hostEmail: '',
    eventVenueId: '',
    eventLocation: '',
    eventName: '',
    eventType: '',
    eventVenue: '',
    hostID: '',
    hostName: '',
    seatedEvent: '',
    image1: '',
    image2: '',
    image3: '',
    published: '',
    startDateTime: '',
    totalTicketAmount:'',
  });
  const [hostName, setHostName] = useState('');
  const [imageArray, setImageArray] = useState([]);
  const [ticketModal, setTicketModal] = useState(false); //opening and closing the purchasing ticket modal 
  const [allTicketTypes, setAllTicketTypes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [logInPrompt, setLogInPrompt] = useState(false);
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
  // responsive prop for carousel 
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const styles = {
    BoxContainer: {
      display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      flexDirection: 'column',
      padding: '3vw',
      margin: '1vw 5vw 5vw 5vw'
    },
    ImageContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // padding: '3vw',
      // margin: '9vw'
    },
    detailSec: {
      margin: '0',
      fontFamily: "Helvetica",
      fontSize: "1rem",
      letterSpacing: "0.00938em",
      color: "rgba(0, 0, 0, 0.6)",
      fontWeight: "bold"
    }
  }
  // const getHostInfo = async(eventDetails) => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'auth-token': localStorage.getItem('token'),
  //     },
  //   }
  //   const response = await fetch(`http://localhost:3000/user/profile/${eventDetails.hostID}`, requestOptions
  //   )
  //   if (response.ok) {
  //     const json = (await response.json()).user;
  //     console.log(json);
  //     const firstName = json.firstName;
  //     const lastName = json.lastname;
  //     setHostName(`${firstName} ${lastName}`);
  //   } else {
  //     alert(`error: ${response.status}`)
  //   }
  // }
  
  // const getReviews = async() => {
  //   const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //   })
  //   const json = await response.json();
  //   const allReviews = []
  //   console.log(json);
  //   if (json.reviews.length !== 0) {
  //     for (const rev of json.reviews) {
  //       allReviews.push(rev);
  //     }
  //     setReviews(allReviews)
  //   }
  // }
  const handleTicketModal = () => {
    //setTicketModal(false);
    if (localStorage.getItem('token') !== null) {
      setTicketModal(true);
      setLogInPrompt(false);
  } else {
      setTicketModal(false);
      setLogInPrompt(true);
  }
  }
  const handleShowReviews = (e) => {
    if (showReviews) {
      setShowReviews(false);
    } else {
      setShowReviews(true);
    }
  }
  const dateOptions = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true
  }
  const getTicketInfo = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/ticketTypes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'auth-token': localStorage.getItem('token'),
      },
    })
    const json = await response.json();
    const tickets = []
    console.log(json);
    for (const ticket of json.tickets) {
      tickets.push(ticket);
    }
    setAllTicketTypes(tickets);
  }
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
    console.log(eventDetails);
    const fetchedImages = [eventDetails.image1,eventDetails.image2, eventDetails.image3];
    const nonEmptyImages = fetchedImages.filter(image => {
      return image !== "";
    });
    console.log("non empty image",nonEmptyImages);
    console.log(eventDetails);
    setImageArray(nonEmptyImages);
    setEventInfo({...eventDetails});
     //getHostInfo(eventDetails);
      
  }
  useEffect(()=> {
    getEventInfo();
    getTicketInfo();
    
  },[]);

  return (
    <>
      <Box sx={styles.BoxContainer}>
        <Box sx={styles.ImageContainer}>
          <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={1000} containerClass="carousel-container" style= {{width:"70%",height:"40%"}} ssr={true} dotListClass="custom-dot-list-style" deviceType="desktop">
            
            {
              imageArray.map((image,index) => {
              return (
                <div key={index} style={styles.ImageContainer}>
                  <img src= {image} key={index} alt="pic of event" style= {{width:"70%"}}/>
                </div>
                
                )
            })
          }
            
          </Carousel>
        </Box>
        <Box id="content container" sx={{marginTop: "2%", padding: "1% 3% 3% 3%"}}>
          <Box id="header section" sx={{marginTop: "1%", display: 'flex', gap: '20vw'}}>
            <Box id="heading content">
              <Typography variant="h2" color="text.secondary">
                {eventInfo.eventName}
              </Typography>
              <Typography component = "div" variant="h5" color="text.secondary">
                Host : {eventInfo.hostName}
              </Typography>
            </Box>
            <Box id="button container" style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "35%"}}>
              <Button
                variant ='outlined'
                id = 'Purchase Ticket Button'
                size='large'
                onClick = {() => handleTicketModal()}
              > Buy Tickets
              </Button>
              {ticketModal === true ? (
                <PurchaseTicket 
                  eventInfo = {eventInfo} 
                  setEventInfo={setEventInfo} 
                  ticketModal={ticketModal} 
                  setTicketModal ={setTicketModal}/>):null}
              {logInPrompt === true ? (
                <LogInPurchaseModal 
                  logInPrompt= {logInPrompt}
                  setLogInPrompt ={setLogInPrompt}/>):null}
            </Box>
            </Box>
          <Box id="details section" sx={{marginTop: "2%"}}>
            <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Event Type: {eventInfo.eventType}
            </Typography>
            <Typography   variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Venue: {eventInfo.eventVenue}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Location: {eventInfo.eventLocation}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Start Date and Time: {(new Date(eventInfo.startDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              End Date and Time: {(new Date(eventInfo.endDateTime)).toLocaleString("en-AU",dateOptions)}
            </Typography>
          </Box>
          <Box id="description section" sx={{marginTop: "4%"}}>
            <Typography variant="h5" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{fontSize: "1.12rem"}}>
              {eventInfo.eventDescription}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5"color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
            Ticket types and price
            </Typography>
            {allTicketTypes.map((obj,idx)=> {
              return (
              <Typography key={idx} variant="body1" color="text.secondary" sx={{fontSize: "1.12rem"}}>
                {"Type: "+obj.ticketType +" | Price:$"+obj.price}
              </Typography>
              )
            })}
          </Box>
          <Box>
            <Stack spacing={2} direction="row">
              <Button variant="outlined" onClick={handleShowReviews}>{`Reviews (${eventObj.reviews.length})`}</Button>
            </Stack>
            {Array(Math.ceil(eventObj.ratingRatio * 5))
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
            {Array(5 - Math.ceil(eventObj.ratingRatio * 5))
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
          </Box>
          {showReviews && <ViewReviews showReviews={showReviews} setShowReviews={setShowReviews} eventReviews={eventObj.reviews} eventId={eventId}/>}
        </Box>
      </Box>
    </>
  );
};
export default ViewEvent;