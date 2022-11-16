import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl,Grid } from '@mui/material';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import LeaveReviewForm from '../components/leaveReviewForm';
import EditReviewForm from '../components/editReviewForm';
import UserViewPurchasedTix from '../components/UserViewPurchasedTix';
const MyEvents = () => {
  const [attendingEvents, setAttendingEvents] = React.useState([]);
  const [openReviewForm, setOpenReviewForm] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [averageRatingHook, setAverageRating] =React.useState(0);
  const [ratingRatioHook, setRatingRatio] = React.useState(0);
  const [edited, setEdited] = React.useState(false);
  const [myReview, setMyReview] = React.useState('');
  const [editForm, setEditForm] = React.useState(false);
  const [editFormObj, setEditFormObj] = React.useState({});
  const [reviewFormObj, setReviewFormObj] = React.useState({});
  const [puchasedModal, setPuchasedModal] = React.useState(false);


  const handleForm = (obj) => {
    setReviewFormObj(obj);
    if(openReviewForm) {
      setOpenReviewForm(false);
    } else {
      setOpenReviewForm(true);
    }
  }

  const handleEdit = (obj) => {
    setEditFormObj(obj);
    if(editForm) {
      setEditForm(false);
    } else {
      setEditForm(true);
      
    }
  }
  const getReviews = async(eventId) => {
    let json = []

    if (localStorage.getItem('token')) { 
      const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
       
      })
      json = await response.json();
    } else {
      const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
    }
    allInfo = [allReviews, averageRating, ratingRatio];
    return allInfo;
  }

  const checkReview = async(eventId) => {
    let edited = false;
    let info = [edited, {}];
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/leftReview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    const json = await response.json();
    if(json.reviews.length !== 0) {
      edited = true;
      setMyReview(json.reviews[0])
      info = [edited,json.reviews[0]]
    } else {
      edited = false;
    }
    console.log('edited',json)
    return info;
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
    console.log('attending events json',json);
    const allMyEvents = []
    for (const event of json.events) {
      const allInfoArray = await getReviews(event.eventID);
      const editedInfo = await checkReview(event.eventID);
      allMyEvents.push({
        venueCapacity: event.venueCapacity,
        capacity: event.capacity,
        endDateTime: event.endDateTime,
        eventDescription: event.eventDescription,
        eventID: event.eventID,
        eventLocation: event.eventLocation,
        eventName: event.eventName,
        eventType: event.eventType,
        eventVenue: event.eventVenue,
        hostID: event.hostID,
        hostName: event.hostName,
        image1: event.image1,
        image2: event.image2,
        image3: event.image3,
        seatedEvent: event.seatedEvent,
        published: event.published,
        startDateTime: event.startDateTime,
        totalTicketAmount:event.totalTicketAmount,
        reviews: allInfoArray[0],
        averageRating: allInfoArray[1],
        ratingRatio: allInfoArray[2],
        leftReview: editedInfo[0],
        prevReview: editedInfo[1]
      })
    }
    setAttendingEvents(allMyEvents);
  }

  // upon entering the page 
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchAttendingEvents();

  }, [editForm,openReviewForm]);

  return (
    <Grid container spacing={1} style={{padding: "3.2rem"}}>  
      <Grid item xs={12}>
        <Typography variant="h5"  color="text.secondary" style={{textAlign:"center"}}>
          Your purchased Events
        </Typography>
      </Grid>
    <Grid item xs= {12}>
    <Grid container spacing ={6}>
      {attendingEvents.map((obj, idx) => {
      return (
      <Grid container item xs={12} >
        <LeaveReviewForm openReviewForm={openReviewForm} setOpenReviewForm={setOpenReviewForm} obj={reviewFormObj}></LeaveReviewForm>
        {editForm && <EditReviewForm editForm={editForm} setEditForm={setEditForm} obj={editFormObj}></EditReviewForm>}
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
                {`Event Type: ${obj.eventType} | Venue: ${obj.eventVenue} | Event Capacity: ${obj.capacity}`}
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
                <Button component={Link}
                  to= {{pathname: `/event/view/${obj.eventID}`}}
                  state= {obj}
                  size="small">
                    view
                </Button>
                <Button 
                  component={Link}
                  to= {{pathname: `/events/user/tickets/${obj.eventID}`}}
                >
                    view your order
                </Button>
                {!obj.leftReview && <Button onClick={()=>handleForm(obj)}>
                  Leave Review
                </Button>}
                {obj.leftReview && <Button onClick={()=>handleEdit(obj)}>Edit Review</Button>}
              </CardActions>
            </Box>
          </Box>
        </Card> 
      </Grid>
      )
    })}
    </Grid>
  </Grid>
  </Grid>
  )

}

export default MyEvents;


