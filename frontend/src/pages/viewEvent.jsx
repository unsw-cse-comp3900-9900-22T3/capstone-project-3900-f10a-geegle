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
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
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
const ViewEvent= () => {
  const { eventId} = useParams();
  const [eventInfo, setEventInfo] = useState({
    capacity: '',
    endDateTime: '',
    eventDescription: '',
    eventID: '',
    eventLocation: '',
    eventName: '',
    eventType: '',
    eventVenue: '',
    hostID: '',
    image1: '',
    image2: '',
    image3: '',
    published: '',
    startDateTime: '',
    totalTicketAmount:'',
  });
  const [hostName, setHostName] = useState('');
  const [imageArray, setImageArray] = useState([]);


  const getHostInfo = async(eventDetails) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token'),
      },
    }
    const response = await fetch(`http://localhost:3000/user/profile/${eventDetails.hostID}`, requestOptions
    )
    if (response.ok) {
      const json = (await response.json()).user;
      console.log(json);
      const firstName = json.firstName;
      const lastName = json.lastname;
      setHostName(`${firstName} ${lastName}`);
    } else {
      alert(`error: ${response.status}`)
    }
  }
    
  
  const getEventInfo = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/info`, {
      method: 'GET'
    })
    const eventJson = (await response.json()).event;
    const eventDetails = {
      capacity: eventJson.capacity,
      endDateTime: eventJson.endDateTime,
      eventDescription: eventJson.eventDescription,
      eventID: eventJson.eventID,
      eventLocation: eventJson.eventLocation,
      eventName: eventJson.eventName,
      eventType: eventJson.eventType,
      eventVenue: eventJson.eventVenue,
      hostID: eventJson.hostID,
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
    
    
  },[]);

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
  return (
    <>
      <Box sx={styles.BoxContainer}>
        <Box sx={styles.ImageContainer}>
          <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={1000} containerClass="carousel-container" style= {{width:"70%",height:"40%"}} ssr={true} dotListClass="custom-dot-list-style" deviceType="desktop">
            
            {
              imageArray.map((image,index) => {
                console.log("image",image);
              return (
                <div style={styles.ImageContainer}>
                  <img src= {image} key={index} alt="pic of event" style= {{width:"70%"}}/>
                </div>
                
                )
            })
          }
            
          </Carousel>
        </Box>
        <Box id="content container" sx={{marginTop: "2%", padding: "1% 3% 3% 3%"}}>
          <Box id="heading section" sx={{marginTop: "1%"}}>
            <Typography variant="h2" color="text.secondary">
              {eventInfo.eventName}
            </Typography>
            <Typography component = "div" variant="h5" color="text.secondary">
              Host : Host Name
            </Typography>
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
              Start Date and Time: {eventInfo.startDateTime}
            </Typography>
            <Typography  variant="h6" color="text.secondary" sx={{fontWeight: "bold", lineHeight: "1.2"}}>
              End Date and Time: {eventInfo.endDateTime}
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
          
        </Box>
          
      </Box>
    </>
    
  );
};
export default ViewEvent ;