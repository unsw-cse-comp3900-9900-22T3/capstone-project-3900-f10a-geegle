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
  const [reviews, setReviews] = React.useState([]);
  const [averageRatingHook, setAverageRating] =React.useState(0);
  const [ratingRatioHook, setRatingRatio] = React.useState(0);
  const [toggleState, setToggleState] = React.useState('All Events');
  const [allEventReviews, setAllEventReviews] = React.useState(['']);

  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    //console.log(newAlignment);
  };
  const getReviews = async(eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await response.json();
    const allReviews = []
    let totalRating = 0
    let ratingRatio = 0
    let averageRating = 0
    let allInfo = [allReviews, averageRating, ratingRatio];
    console.log(json);
    if (json.reviews.length !== 0) {
      for (const rev of json.reviews) {
        allReviews.push(rev);
        totalRating = totalRating + rev.rating;
      }
      averageRating = (totalRating)/(json.reviews.length)
      ratingRatio = (totalRating)/(json.reviews.length * 5)
      // setRatingRatio(ratingRatio)
      // setAverageRating(averageRating)
      // setReviews(allReviews)

    } else {
      // setRatingRatio(0)
      // setAverageRating(0)
      // setReviews([])
    }
    //return allInfo
    setAllEventReviews([...allEventReviews, ''])
    allInfo = [allReviews, averageRating, ratingRatio];
    return allInfo;
  }


  const fetchAllEvents = async () => {
    
    const response = await fetch(`http://localhost:3000/events/all`, {
      method: 'GET',
    })
    const json = await response.json();
      console.log(json);
      const events = []
      for (const eve of json.events) {
        const allInfoArray = await getReviews(eve.eventID)
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
            reviews:allInfoArray[0],
            averageRating: allInfoArray[1],
            ratingRatio: allInfoArray[2]
          }
        })
      }
      console.log(allListings);
      setAllListings(events)
      return events;
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
        const allInfoArray = await getReviews(eve.eventID)
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
            reviews:allInfoArray[0],
            averageRating: allInfoArray[1],
            ratingRatio: allInfoArray[2]
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
            {Array(Math.ceil(obj.eachEvent.ratingRatio * 5))
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
            {Array(5 - Math.ceil(obj.eachEvent.ratingRatio * 5))
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
              Average Rating: {obj.eachEvent.averageRating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews: {obj.eachEvent.reviews.length}
            </Typography>

          </CardContent>
          <CardActions>
            <Button 
              component={Link}
              to= {{pathname: `/event/view/${obj.eachEvent.eventID}`}}
              //state= {{state: obj.eachEvent}}
              state= {obj.eachEvent}
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
            {Array(Math.ceil(obj.eachEvent.ratingRatio * 5))
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
            {Array(5 - Math.ceil(obj.eachEvent.ratingRatio * 5))
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
              Average Rating: {obj.eachEvent.averageRating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews: {obj.eachEvent.reviews.length}
            </Typography>
          </CardContent>
          <CardActions>
              <Button 
                component={Link}
                to= {{pathname: `/event/view/${obj.eachEvent.eventID}`}}
                //state= {{eventObj: allListings}}
                state= {obj.eachEvent}
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