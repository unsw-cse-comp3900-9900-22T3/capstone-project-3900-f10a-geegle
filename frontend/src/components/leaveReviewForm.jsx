/* eslint-disable */ 
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';

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

/**
 * Functional requirement that renders the form to leave their review
 * on a purchased event
 */
export default function LeaveReviewForm({openReviewForm, setOpenReviewForm, obj}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [review, setReview] = React.useState('');
  const [rating, setRating] = React.useState('');
  const [ratingError, setRatingError] = React.useState(false);
  const [reviewError, setReviewError] = React.useState(false);
  
  /**
   *  Function that closes leave review form
   */
  const handleClose = () => {
    setOpenReviewForm(false);
    setSubmitted(false);
  } 

  /**
   *  Function that submits the review and if 
   *  successful it will return a successful message to the user
   */
  const handleSubmit = async() => {
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
      setReviewError(false)
    } else if(response.status === 400){
      setSubmitted(false)
      setReviewError(true)
    }
  }

  /**
   *  Function that sets rating giving by the user and check if a rating was given 
   *  by the user
   */
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
            <Grid item xs={12}>
                <FormControl style={{ width: '35%' }}>
                  <InputLabel id="Event Rating label">Event Rating Equivalent or Higher</InputLabel>
                  <Select
                    labelId="Event Rating label"
                    id="Event Rating"
                    label="Event Rating"
                    aria-label="Event Rating"
                    value={rating}
                    onChange={(e)=>handleRating(e)}
                  >
                    <MenuItem value={'1'}>1</MenuItem>
                    <MenuItem value={'2'}>2</MenuItem>
                    <MenuItem value={'3'}>3</MenuItem>
                    <MenuItem value={'4'}>4</MenuItem>
                    <MenuItem value={'5'}>5</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            {/* <TextField
              id="standard-multiline-static"
              label="Rate it out of 5..."
              multiline
              fullWidth
              type='number'
              onChange={(e)=>handleRating(e)}
            /> */}
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
          {reviewError &&  <Typography variant="h6" component="div" color='red'>
              Rating/ Review must not be emtpty
          </Typography>}
        </Box>
      </Modal>
    </div>
  );
}
