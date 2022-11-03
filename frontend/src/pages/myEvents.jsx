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
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import LeaveReviewForm from '../components/leaveReviewForm';

const MyEvents = () => {
  const [attendingEvents, setAttendingEvents] = React.useState([]);
  const [openReviewForm, setOpenReviewForm] = React.useState(false);

  const handleForm = () => {
    if(openReviewForm) {
      setOpenReviewForm(false);
    } else {
      setOpenReviewForm(true);
    }
  }
  const fetchAttendingEvents = async () => {
    const response = await fetch(`http://localhost:3000/events/attending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    const allMyEvents = []
    for (const event of json.events) {
      const eventId = event.eventID;
      const eventInfoRes = await fetch(`http://localhost:3000/events/${eventId}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //'auth-token': localStorage.getItem('token'),
        },
      });
      const eventJson = (await response.json()).event;

      allMyEvents.push({
        venueCapacity: eventJson.venueCapacity,
        capacity: eventJson.capacity,
        endDateTime: eventJson.endDateTime,
        eventDescription: eventJson.eventDescription,
        eventID: eventJson.eventID,
        eventLocation: eventJson.eventLocation,
        eventName: eventJson.eventName,
        eventType: eventJson.eventType,
        eventVenue: eventJson.eventVenue,
        hostID: eventJson.hostID,
        hostName: eventJson.hostName,
        image1: eventJson.image1,
        image2: eventJson.image2,
        image3: eventJson.image3,
        published: eventJson.published,
        startDateTime: eventJson.startDateTime,
        totalTicketAmount:eventJson.totalTicketAmount,
      })
    }
    setAttendingEvents(allMyEvents);
  }

  // upon entering the page 
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchAttendingEvents();
  }, []);
  return (
    <>
    <div>My events Page</div>
    <LeaveReviewForm openReviewForm={openReviewForm} setOpenReviewForm={setOpenReviewForm}></LeaveReviewForm>
    {attendingEvents.map((obj, idx) => {
      return (
      <Card sx={{ maxWidth: '100%' ,display: 'grid', gridTemplateColumns: '3fr 6fr'}}>
        <CardMedia
            component="img"
            height="100%"
            image={obj.eachEvent.image1}
            alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {obj.eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {obj.eventType +' | '+ obj.eventVenue+' | Event Capacity: '+obj.eachEvent.capacity+'| Venue Capacity'+ obj.eachEvent.venueCapacity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {"Description: "+ obj.eventDescription}
          </Typography>
        </CardContent>
        <CardActions>
            <Button component={Link}
              to= {{pathname: `/event/view/${obj.eventID}`}}
              size="small">
                view
            </Button>
            <Button onClick={handleForm}>
              Leave Review
            </Button>
        </CardActions>
      </Card> 
      )
    })}
    </>
  )
}

export default MyEvents;