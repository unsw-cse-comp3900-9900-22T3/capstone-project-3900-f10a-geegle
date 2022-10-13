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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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

const PublicLanding = () => {
  const [allListings, setAllListings] = React.useState([]);
  const [upcomingListings, setUpcomingListings] = React.useState([]);
  const [toggleState, setToggleState] = React.useState('All Events');

  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    //console.log(newAlignment);
  };
  
  const fetchAllEvents = async () => {
    
    const response = await fetch(`http://localhost:3000/events/all`, {
      method: 'GET',
    })
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
      setAllListings(events)
      //console.log(allListings)
      // setMyListings(json);
  }
  
  const fetchUpcomingEvents = async () => {
    
    const response = await fetch(`http://localhost:3000/events/upcoming`, {
      method: 'GET'
    })
    const json = await response.json();
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
      setUpcomingListings(events)
      //console.log(upcomingListings)
  }

  // upon entering the page
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchAllEvents();
    fetchUpcomingEvents();
  }, []);
  
  return (
    <>  
    <div>
      <ToggleButtonGroup
        color="primary"
        value={toggleState}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="All Events">All Events</ToggleButton>
        <ToggleButton value="Upcoming Events">Upcoming Events</ToggleButton>
      </ToggleButtonGroup>
    </div>
    {
    
    
      toggleState === 'All Events'?
      allListings.map((obj, idx) => {
        return (
        <Card key={idx} sx={{ maxWidth: '100%' ,display: 'grid', gridTemplateColumns: '3fr 6fr'}}>
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
            <Button 
              component={Link}
              to= {{pathname: `/event/view/${obj.eachEvent.eventID}`}}
              size="small">
                view
            </Button>
          </CardActions>
        </Card> 
        )
      }) : (
        upcomingListings.map((obj, idx) => {
        return (
        <Card key = {idx} sx={{ maxWidth: '100%' ,display: 'grid', gridTemplateColumns: '3fr 6fr'}}>
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
              <Button 
                component={Link}
                to= {{pathname: `/event/view/${obj.eachEvent.eventID}`}}
                size="small">
                  view
              </Button>
          </CardActions>
        </Card> 
        )
      })
      ) 
    }
    </>
  );
};
export default PublicLanding ;