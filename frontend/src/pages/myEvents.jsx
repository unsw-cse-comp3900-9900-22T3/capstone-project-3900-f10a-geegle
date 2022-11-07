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
import EditReviewForm from '../components/editReviewForm';

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


  const handleForm = () => {
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
      // setEditFormObj(obj);
    } else {
      setEditForm(true);
      //setEditFormObj({});
      
    }
  }
  const getReviews = async(eventId) => {
    // let userID = -1;
    // if (!localStorage.getItem('userId')) {
    //   userID = -1;
    // } else {
    //   userID = parseInt(localStorage.getItem('userId'))
    // }
    // console.log("here", userID);
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({userID:userID }),
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
      const eventJson = (await eventInfoRes.json()).event;
      const allInfoArray = await getReviews(eventId);
      const editedInfo = await checkReview(eventId);
      console.log('editedInfo', editedInfo)
      console.log(eventJson);

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
    <>
    <div>My events Page</div>
    {attendingEvents.map((obj, idx) => {
      return (
      <div key={idx}>
        <LeaveReviewForm openReviewForm={openReviewForm} setOpenReviewForm={setOpenReviewForm} obj={obj}></LeaveReviewForm>
        {editForm && <EditReviewForm editForm={editForm} setEditForm={setEditForm} obj={editFormObj}></EditReviewForm>}
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
          </CardContent>
          <CardActions>
              <Button component={Link}
                to= {{pathname: `/event/view/${obj.eventID}`}}
                state= {obj}
                size="small">
                  view
              </Button>
              {!obj.leftReview && <Button onClick={handleForm}>
                Leave Review
              </Button>}
              {/* <Button onClick={handleForm}>
                Leave Review
              </Button> */}
              {obj.leftReview && <Button onClick={()=>handleEdit(obj)}>Edit Review</Button>}
          </CardActions>
        </Card> 
      </div>
      )
    })}
    </>
  )
}

export default MyEvents;