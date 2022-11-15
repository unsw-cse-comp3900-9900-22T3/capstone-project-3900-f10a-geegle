import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LeaveReviewForm({openReviewForm, setOpenReviewForm, obj}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState('');
  const [ratingError, setRatingError] = React.useState(false);
  console.log(obj);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpenReviewForm(false);
    setSubmitted(false);
  } 

  const handleSubmit = async() => {
    console.log('submitted');
    console.log('eventId',obj.eventID);
    const response = await fetch(`http://localhost:3000/events/${obj.eventID}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        review: review,
        rating: rating
      })
    })
    const json = await response.json();
    if (response.ok) {
      setSubmitted(true)
    } else {
      setSubmitted(false)
    }
  }
  const handleRating = async(e) => {
    if (parseFloat(e.target.value) > 5){
      setRatingError(true);
    } else {
      setRating(e.target.value);
      setRatingError(false);
    }
  }

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={openReviewForm}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!submitted && <form onSubmit={handleSubmit}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Leave A Review
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Your Review:
            </Typography>
            <TextField
              id="standard-multiline-static"
              label="Write what you think of the event here.."
              multiline
              fullWidth
              rows={6}
              type='text'
              onChange={(e)=>setReview(e.target.value)}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Your Rating:
            </Typography>
            <TextField
              id="standard-multiline-static"
              label="Rate it out of 5..."
              multiline
              fullWidth
              type='number'
              onChange={(e)=>handleRating(e)}
            />
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </form>}
          {submitted &&  <Typography variant="h6" component="div" color='green'>
              Review Submitted, close this modal to edit!
          </Typography>}
          {ratingError &&  <Typography variant="h6" component="div" color='red'>
              Rating must be smaller than 5
          </Typography>}
        </Box>
      </Modal>
    </div>
  );
}
