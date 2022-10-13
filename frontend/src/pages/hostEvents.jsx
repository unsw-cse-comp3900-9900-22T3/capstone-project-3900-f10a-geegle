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
import { Navigate, useNavigate } from 'react-router-dom';

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

const HostEventsPage = () => {
  const [myListings, setMyListings] = React.useState([]);
  // const [publishedListings, setPublishedListings] = React.useState([]);

  const handlePublish = async(obj, idx) => {
    const response = await fetch(`http://localhost:3000/events/${obj.eachEvent.eventID}/publish`, {
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

  const handleUnpublish = async(obj, idx) => {
    const response = await fetch(`http://localhost:3000/events/${obj.eachEvent.eventID}/cancel`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token'),
      },
    });
    if (response.ok) {
      console.log('unPublished!')
      fetchHostEvents();
    };

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
      console.log(json);
      const events = []
      for (const eve of json.events) {
        events.push({
          eachEvent: {
            capacity: eve.capacity,
            endDateTime: eve.endDateTime,
            eventDescription: eve.eventDescription,
            eventID: eve.eventID,
            eventLocation: eve.eventLocation,
            eventName: eve.eventName,
            eventType: eve.eventType,
            eventVenue: eve.eventVenue,
            hostID: eve.hostID,
            image1: eve.image1,
            image2: eve.image2,
            image3: eve.image3,
            published: eve.published,
            startDateTime: eve.startDateTime,
            totalTicketAmount:eve.totalTicketAmount,
          }
        })
      }
      setMyListings(events)
      // setMyListings(json);
    }
  }

     // upon entering the page
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchHostEvents();
  }, []);
  
  return (
    <>  
    <div>
      Your Events
    </div>
    {myListings.map((obj, idx) => {
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
          {obj.eachEvent.eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {obj.eachEvent.eventType +' | '+ obj.eachEvent.eventVenue+' | '+obj.eachEvent.capacity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {"Description: "+ obj.eachEvent.eventDescription}
          </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">view</Button>
            {obj.eachEvent.published && <Button size="small" onClick={e=>handleUnpublish(obj, idx)}>Cancel</Button>}
            {!obj.eachEvent.published && <Button size="small" onClick={e=>handlePublish(obj, idx)}>publish</Button>}
        </CardActions>
      </Card> 
      )
    })}
    </>
  );
};
export default HostEventsPage;