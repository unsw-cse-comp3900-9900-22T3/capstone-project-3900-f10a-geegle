/* eslint-disable */ 
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActions, FormControl, TextField } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

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
  overflow:'scroll'
};

/**
 * Modal that shows replies to a review, and send reply form 
 * for the user
 */
function ChildModal({reviewId, eventId}) {
  const [open, setOpen] = React.useState(false);
  const [replies, setReplies] = React.useState([]);
  const [newReply, setNewReply] = React.useState("");
  const [sentReply, setSentReply] = React.useState(false);
  const [loginErr, setLoginErr] = React.useState(false);
  
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSentReply(false)
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
      setLoginErr(false);
      const json = await response.json()
      let replyObj = JSON.stringify({
        replies: {
          replyID: json.replies.replyID,
          reviewID: json.replies.reviewID,
          reply: json.replies.reply,
          repliedOn: json.replies.repliedOn,
          userID: json.replies.userID,
          user: json.replies.user
        }
      })
      fetchReplies();
      setNewReply("");
      const emailRes = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/emailReply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: replyObj
      })
      const jsonEmail = await emailRes.json();
      console.log(jsonEmail);
      setSentReply(true);
    } else if(response.status === 401) {
      setLoginErr(true);
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
    if (json.replies.length !== 0) {
      for (const rep of json.replies) {
        allReplies.push(rep);
      }
      setReplies(allReplies)
    }
  }

  const handleReply = (e) => {
    setNewReply(e.target.value);
    setSentReply(false);
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
                  onChange={(e) => handleReply(e)}
                  value={newReply}
                  fullWidth

                />
                <Button 
                  variant="contained"
                  onClick={() => handleSendReply() }>
                  Send Reply
              </Button>
              {sentReply && <Typography variant="h6" component="div" color='green'>
                Replied and Email has been sent to review authur!
              </Typography>}
              {loginErr && <Typography variant="h6" component="div" color='red'>
                Please login to leave a review
              </Typography>}
            </FormControl>
          </Box>
          <Button onClick={handleClose}>Back</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

/**
 * Modal that shows reviews and ratings of the event
 */
const ViewReviews = ({showReviews, setShowReviews, eventReviews, eventId,getEventInfo}) => {
  const [reviews, setReviews] = React.useState(eventReviews);
  const [loginErr, setloginErr] = React.useState(false);
 

  const likeReview = async(reviewId, eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    })
    if (response.ok) {
      setloginErr(false);
      const jsonReviewLiked = await (response.json());
      await fetchReviews(eventId);
      await getEventInfo();
    } else if (response.status === 401){
      setloginErr(true);

    }
  }
  const fetchReviews = async(eventId) => {
    let json = []
      if (localStorage.getItem('token')) { 
        const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        })
        if (response.ok) {
          json = await response.json();
        }
      } else {
        const response = await fetch(`http://localhost:3000/events/${eventId}/reviews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok){
          json = await response.json();
        }
      }
      setReviews(json.reviews);

  }

  const unlikeReview = async(reviewId, eventId) => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/reviews/${reviewId}/unlike`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    })
    if (response.ok) {
      setloginErr(false);
      const jsonReviewUnLiked = await (response.json());
      await fetchReviews(eventId);
      await getEventInfo();
    } else if (response.status === 401){
      setloginErr(true);
    }
  }

  return (
    <div>
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
          {loginErr && <Typography variant="body2" color="red">
            Please Log in to Like/Unlike
          </Typography>}
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
        </Box>
      </Modal>
    </div>
  );
}

export default ViewReviews;