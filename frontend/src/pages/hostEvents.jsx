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

const HostEventsPage = () => {
  const [myListings, setMyListings] = React.useState([]);
  const [customerModal, setCustomerModal] = React.useState(false);
  const [clickedEventInfo, setClickedEventInfo] = React.useState({});

  const handleViewCustomers = (eventInfo) => {
    setCustomerModal(true);
    setClickedEventInfo({...eventInfo});
  }

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
      console.log('host payload', json);
      // const events = []
      // for (const eve of json.events) {
      //   events.push({
      //     eachEvent: {
      //       venueCapacity: eve.venueCapacity,
      //       capacity: eve.capacity,
      //       endDateTime: eve.endDateTime,
      //       eventDescription: eve.eventDescription,
      //       eventID: eve.eventID,
      //       eventLocation: eve.eventLocation,
      //       eventName: eve.eventName,
      //       eventType: eve.eventType,
      //       eventVenue: eve.eventVenue,
      //       hostID: eve.hostID,
      //       image1: eve.image1,
      //       image2: eve.image2,
      //       image3: eve.image3,
      //       published: eve.published,
      //       startDateTime: eve.startDateTime,
      //       totalTicketAmount:eve.totalTicketAmount,
      //       seatedEvent:eve.seatedEvent
      //     }
      //   })
      // }
      setMyListings(json.events)
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
            image={obj.image1}
            alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {obj.eventName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {obj.eventType +' | '+ obj.eventVenue+' | Event Capacity: '+obj.capacity+'| Venue Capacity'+ obj.venueCapacity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          {"Description: "+ obj.eventDescription}
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
              Reviews: {obj.reviews.length}
            </Typography>
        </CardContent>
        <CardActions>
            <Button 
              component={Link}
              to= {{pathname: `/event/view/${obj.eventID}`}}
              state= {obj}
              size="small">
                view
            </Button>
            {obj.published && <Button size="small" onClick={()=>handleViewCustomers(obj.eachEvent)}>Customers</Button>}
            {obj.published && <Button size="small" onClick={e=>handleUnpublish(obj, idx)}>Cancel</Button>}
            {!obj.published && <Button size="small" onClick={e=>handlePublish(obj, idx)}>publish</Button>}
        </CardActions>
      </Card> 
      )
    })}
    {customerModal === true ? (<ViewCustomers 
      customerModal={customerModal}
      clickedEventInfo = {clickedEventInfo}
      setCustomerModal = {setCustomerModal}/>) : null}
    </>
  );
};
export default HostEventsPage;