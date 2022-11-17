/* eslint-disable */ 
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useNavigate } from 'react-router-dom';
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
 * Functional component that renders edit review form for customers to 
 * edit their review once a review is left by them on a purchased event
 * 
 */
export default function EditReviewForm({editForm, setEditForm, obj}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [review, setReview] = React.useState(obj.prevReview.review);
  const [rating, setRating] = React.useState(obj.prevReview.rating);
  const [prevReview, setPrevReview] = React.useState(obj.prevReview.review);
  const [ratingError, setRatingError] = React.useState(false);
  const [formError, setFormError] = React.useState(false);
  const handleRating = async(e) => {
    if (parseFloat(e.target.value) > 5){
      setRatingError(true);
    } else {
      setRating(e.target.value);
      setRatingError(false);
    }
  }
  
  /**
   * close the edit modal 
   */
  const handleClose = () => {
    setEditForm(false);
    setSubmitted(false);
  };

  /**
   * function that handles if editted review could be submitted to the event 
   */
  const handleSubmit = async() => {
    let jsonString = "";
    if (review === '') {
      jsonString = JSON.stringify({
        review: prevReview,
        rating: rating
      });
    } else {
      jsonString = JSON.stringify({
        review: review,
        rating: rating
      });
    }
    const response = await fetch(`http://localhost:3000/events/${obj.eventID}/reviews/${obj.prevReview.reviewID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: jsonString
    })
    const json = await response.json();
    if (response.ok) {
      setSubmitted(true);
      setFormError(false);
    } else {
      setSubmitted(false);
      setFormError(true);
    }
  }

  return (
    <div>
      <Modal
        open={editForm}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!submitted && <form onSubmit={handleSubmit}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Your Review
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
              defaultValue={obj.prevReview.review}
              onChange={(e)=>setReview(e.target.value)}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Your Rating:
            </Typography>
            <Grid item xs={12}>
              <FormControl style={{ width: '35%' }}>
                <InputLabel id="Event Rating label">Rate it out of 5</InputLabel>
                <Select
                  labelId="Event Rating label"
                  id="Event Rating"
                  label="Event Rating"
                  aria-label="Event Rating"
                  defaultValue={obj.prevReview.rating}
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
            <Button onClick={handleSubmit}>
              Submit
            </Button>
          </form>}
          {ratingError &&  <Typography variant="h6" component="div" color='red'>
              Rating must be smaller than 5
          </Typography>}
          {submitted &&  <Typography variant="h6" component="div" color='green'>
              Review Edited!
          </Typography>}
          {formError &&  <Typography variant="h6" component="div" color='red'>
              Cannot Submit, check review and rating!
          </Typography>}
        </Box>
      </Modal>
    </div>
  );
}