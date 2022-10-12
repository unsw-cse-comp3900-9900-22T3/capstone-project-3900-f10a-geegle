import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox } from '@mui/material';
function CreateEvent () {

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [venueName, setVenueName] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  return (
    <form>
      <Grid container spacing ={2}>
        <Grid item xs = {12}>
            <Typography variant="h6" component="div">
              Event Name
            </Typography>
        </Grid>
        <Grid item xs = {12}>
          <TextField
            id="Event Name"
            label="Event Name"
            aria-label="Event Name"
            type="text"
            variant="outlined"
            //onChange={handleProperty}
          />
        </Grid>
        <Grid item xs = {12}>
        <FormControl fullWidth>
              <InputLabel id="Event type label">Event Type</InputLabel>
              <Select
                labelId="Event Type label"
                id="Event Type"
                label="Event Type"
                aria-label="Event Type"
                value={eventType}
                //onChange={handleProperty}
              >
                {/* do we need event types stored in the back end (maybe we need to when we filter?) */}
                <MenuItem value={'Apartment'}>Concert</MenuItem>
                <MenuItem value={'Townhouse'}>Festival</MenuItem>
                <MenuItem value={'House'}>Conference</MenuItem>
                <MenuItem value={'Room'}>Social</MenuItem>
                <MenuItem value={'Suite'}>Other</MenuItem>
              </Select>
            </FormControl>
        </Grid>
      


      </Grid>
    </form>
    
  )
}
export default CreateEvent;