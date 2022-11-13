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
import SearchFilter from '../components/searchFilter';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import FilteredListings from '../components/FilteredListings';
// button styles
const SearchButton = styled(Button)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
  width: '15%',
  height: '15%',
  margin: '1%'
});

const UnFilterButton = styled(Button)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
  width: '15%',
  margin: '1%'
});

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
  const [openSearch, setOpenSearch] = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const navigate = useNavigate();

  console.log('filtered Listings', filteredListings);
  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    //console.log(newAlignment);
  };
  const getReviews = async(eventId) => {
    let json = []

    if (localStorage.getItem('token')) { 
      const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        // body: JSON.stringify({userID:userID }),
      })
      json = await response.json();
    } else {
      const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({userID:userID }),
      })
      json = await response.json();
    }

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

  const handleUnfilter = () => {
    setFilter(false);
    navigate('/');

  }
  // upon entering the page
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchAllEvents();
    fetchUpcomingEvents();
  }, []);
  
  return (
    <>
    {!filter && <Grid item xs={12}>
      <SearchButton onClick={()=>setOpenSearch(true)}>Search/Filter</SearchButton>
    </Grid>}
    {filter && <Grid item xs={12}>
      <UnFilterButton onClick={()=>handleUnfilter()}>UnFilter</UnFilterButton>
    </Grid>}
    {openSearch && <SearchFilter openSearch={openSearch} setOpenSearch={setOpenSearch} setFilter={setFilter} setFilteredListings={setFilteredListings}></SearchFilter>}
    <Grid item xs={12}>
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
    </Grid>
    {filter && <FilteredListings filteredListings={filteredListings}></FilteredListings>}
    {(!filter && toggleState === 'All Events') && (
      
      allListings.map((obj, idx) => {
        return (
        <>
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
        </>
        )
      })
    )}
      
    {(!filter && toggleState === 'Upcoming Events') && 
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
      )}
    )}
    </>
  );
};
export default PublicLanding ;