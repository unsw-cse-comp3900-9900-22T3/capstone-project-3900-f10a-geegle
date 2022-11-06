import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActions, FormControl, TextField } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: '40vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal({reviewId, eventId}) {
  const [open, setOpen] = React.useState(false);
  const [replies, setReplies] = React.useState([]);
  const [newReply, setNewReply] = React.useState("");
  
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSendReply = async() => {
    const jsonString = JSON.stringify({
      reply: newReply
      }
    );
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: jsonString
    })
    
    if (response.ok) {
      fetchReplies();
      setNewReply("");
    }
  }
  const fetchReplies = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/reply`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await response.json();
    const allReplies = []
    console.log(json);
    if (json.replies.length !== 0) {
      for (const rep of json.replies) {
        allReplies.push(rep);
      }
      setReplies(allReplies)
    }
  }

  React.useEffect(()=> {
    fetchReplies();
  }, [])

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Replies</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography gutterBottom variant="h5" component="div">
            Replies 
          </Typography>
          <Box id="replies container" sx={{width:'90%', height: '70%', overflow: 'auto'}}>
            {replies.map((reply,idx) => {
              return (
                <Card sx={{ maxWidth: '100%' }} key={idx}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Reply: {idx + 1}, Posted On:{reply.repliedOn.substring(0, 10)}, User:{reply.user}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User says: {reply.reply}
                    </Typography>
                  </CardContent>
                  <CardActions>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
          <Box id="reply form">
            <FormControl fullWidth>
              <TextField
                  id="reply form"
                  label="Send a Reply"
                  aria-label="Send a Reply"
                  type="text"
                  variant="outlined"
                  onChange={(e) => setNewReply(e.target.value)}
                  value={newReply}
                  fullWidth

                />
                <Button 
                  variant="contained"
                  onClick={() => handleSendReply() }>
                  Send Reply
              </Button>
            </FormControl>
          </Box>
          
          
          {/* <h2 id="parent-modal-title">Text in a modal</h2>
          <p id="parent-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p> */} 
          <Button onClick={handleClose}>Back</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function ViewReviews({showReviews, setShowReviews, eventReviews, eventId}) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);                                              
  // };
  //const { eventId} = useParams();
  const [reviews, setReviews] = React.useState(eventReviews);
  //const [object, setObject] = React.useState({});

  const updateLikes = async(eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await response.json();
    const allReplies = []
    console.log(json);
    if (json.replies.length !== 0) {
      for (const rep of json.replies) {
        allReplies.push(rep);
      }
      //setReplies(allReplies)
    }
  }

  const likeReview = async(reviewId, eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    })
    if (response.ok) {
      console.log(reviews, 'reviews')
      const jsonReviewLiked = await (response.json());
      console.log(jsonReviewLiked.reviews, 'json review liked')
      let oldReviews = reviews;
      const editedReview = jsonReviewLiked.reviews;
      oldReviews = oldReviews.map(r=>r.reviewID !== editedReview.reviewID ? r: editedReview);
      setReviews(oldReviews)

    }
    

  }

  const unlikeReview = async(reviewId, eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/unlike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    })
    if (response.ok) {
      const json = await response.json();
    } 
    
  }

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={showReviews}
        onClose={() => setShowReviews(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography gutterBottom variant="h5" component="div">
            Reviews
          </Typography>
          {reviews.map((review,idx) => {
            //setObject(review);
            return (
              <Card sx={{ maxWidth: '100%' }} key={idx}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Review: {idx + 1}, Posted On:{review.postedOn.substring(0, 10)}, User:{review.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {review.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User says: {review.review}
                  </Typography>
                </CardContent>
                <CardActions>
                  {!review.userLiked && <Button onClick={()=>likeReview(review.reviewID,eventId)} variant="text">Like {review.numLikes}</Button>}
                  {review.userLiked && <Button onClick={()=>unlikeReview(review.reviewID,eventId)}variant="text">unLike {review.numLikes}</Button>}
                  <ChildModal reviewId={review.reviewID} eventId={eventId}/>
                </CardActions>
              </Card>
            );
          })}
          {/* <h2 id="parent-modal-title">Text in a modal</h2>
          <p id="parent-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p> */}
          
        </Box>
      </Modal>
    </div>
  );
}