import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox, Stack, Paper } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';

/**
 * https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
 *  
 */
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  if (!valid) {
    throw Error('file needs to be png, jpg or jpeg image.');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject; 
  });
  
}
function CreateEventsForm () {

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [thumbnail, setThumbnail] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  
  const handleImage2 = async (event) => {
    const image2Data = await fileToDataUrl(event.target.files[0]);
    setImage2(image2Data);
  }
  const handleImage3 = async (event) => {
    const image3Data = await fileToDataUrl(event.target.files[0]);
    setImage3(image3Data);
  }
  const handleThumbnail = async (event) => {
    const thumbnailData = await fileToDataUrl(event.target.files[0]);
    setThumbnail(thumbnailData);
  }
  
  
  const styles = {
    Paper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3vw',
      margin: '9vw'
    }
  }
  return (
    <Paper variant="elevation" square style={styles.Paper} >
      <form>
        <Grid container spacing ={2}>
          <Grid item xs = {12}>
              <Typography variant="h6" component="div">
                Create Your Event
              </Typography>
          </Grid>
          <Grid item xs = {12}>
            <TextField
              id="Event Name"
              label="Event Name"
              aria-label="Event Name"
              type="text"
              variant="outlined"
              onChange={e=>setEventName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs = {12}>
            <FormControl style={{width: '35%'}}>
              <InputLabel id="Event type label">Event Type</InputLabel>
              <Select
                labelId="Event Type label"
                id="Event Type"
                label="Event Type"
                aria-label="Event Type"
                value={eventType}
                onChange={e=>setEventType(e.target.value)}
              >
                {/* do we need event types stored in the back end (maybe we need to when we filter?) */}
                <MenuItem value={'Concert'}>Concert</MenuItem>
                <MenuItem value={'Festival'}>Festival</MenuItem>
                <MenuItem value={'Conference'}>Conference</MenuItem>
                <MenuItem value={'Social'}>Social</MenuItem>
                <MenuItem value={'Other'}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs = {12}>
          <FormControl fullWidth>
              <InputLabel id="location label">Venue and Location</InputLabel>
              <Select
                labelId="location label"
                id="location"
                label="location"
                aria-label="location"
                value={eventLocation}
                onChange={e=>setEventLocation(e.target.value)}
              >
                {/* do we need event types stored in the back end (maybe we need to when we filter?) */}
                <MenuItem value={'Venue 1, Address'}>Venue 1, Address</MenuItem>
                <MenuItem value={'Venue 2, Address'}>Venue 2, Address</MenuItem>
                <MenuItem value={'Venue 3, Address'}>Venue 3, Address</MenuItem>
                <MenuItem value={'Venue 4, Address'}>Venue 4, Address</MenuItem>
                <MenuItem value={'Venue 5, Address'}>Venue 5, Address</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs = {4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DateTimePicker
                  label="start date and time"
                  id='startPicker'
                  value = {startDateTime}
                  onChange={(e) => setStartDateTime(e)}
                  style={{width: '35%'}}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                  label="end date and time"
                  id='endPicker'
                  onChange={(e) => setEndDateTime(e)}
                  style={{width: '35%'}}
                  value = {endDateTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs = {12}>
            {/* thumbnail is image 1 in the database */}
            <Typography variant="h6" component="div"> upload a thumbnail</Typography>
                <input
                  id='thumbnail'
                  aria-label="thumbnailInput"
                  type="file"
                  onChange={handleThumbnail}
            />
          </Grid>
          <Grid item xs = {12}>
            <Typography variant="h6" component="div"> upload a 2nd image</Typography>
                <input
                  id='thumbnail'
                  aria-label="thumbnailInput"
                  type="file"
                  onChange={handleImage2}
            />
          </Grid>
          <Grid item xs = {12}>
            <Typography variant="h6" component="div"> upload a 3rd image</Typography>
                <input
                  id='thumbnail'
                  aria-label="thumbnailInput"
                  type="file"
                  onChange={handleImage3}
            />
          </Grid>
          <Grid item xs = {12}>
            <Grid container spacing ={3}>
              <Grid item xs = {6}>
                <TextField
                id="Ticket Type"
                label="Ticket Type"
                aria-label="Ticket Type"
                type="text"
                variant="outlined"
                onChange={e=>setTicketType(e.target.value)}
                fullWidth
              />
              </Grid>
              <Grid item xs = {3}>
                <TextField
                id="Quantity"
                label="Quantity"
                aria-label="Quantity"
                type="text"
                variant="outlined"
                onChange={e=>setQuantity(e.target.value)}
                fullWidth
              />
              </Grid>
              <Grid item xs = {3}>
                <TextField
                id="price"
                label="price"
                aria-label="price"
                type="text"
                variant="outlined"
                onChange={e=>setTicketPrice(e.target.value)}
                fullWidth
              />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs = {12}>
            <button> Add Another Ticket Type</button>
          </Grid>
          <Grid item xs = {6}>
            <Button> Submit and Create</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
    
    
  )
}
export default CreateEventsForm;