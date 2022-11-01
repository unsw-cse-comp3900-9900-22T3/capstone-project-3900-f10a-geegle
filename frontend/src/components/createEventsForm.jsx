import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Card, Typography, Button, Checkbox, Stack, Paper, Alert } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import TicketTypeInput from './TicketTypeInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import DefaultVenueInfo from './defaultVenueInfo';
import { SentimentSatisfiedAltSharp } from '@mui/icons-material';
/**
 * https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
 *
 */
export function fileToDataUrl(file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
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
function CreateEventsForm() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [venue, setVenue] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [capacity, setCapacity] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [thumbnail, setThumbnail] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [other, setOther] = useState(false);
  const [seat, setSeat] = useState(true);
  const [ticketInfo, setTicketInfo] = useState({
    ticketType: '',
    ticketAmount: '',
    price: '',
    seatSections: []
  });
  const [allTicketTypes, setAllTicketTypes] = useState([ticketInfo]);
  // error check variables 
  const [endTimeError, setEndTimeError] = useState(false); // End time before start time error
  const [negCapacityError, setNegCapacityError] = useState(false); // capacity < 0
  const [startTimeError, setStartTimeError] = useState(false); // start time is before the current time 
  const [insufCapacityError, setInsufCapacityError] = useState(false); // venue capacity < total tickets

  const [ticketInput, setTicketInput] = useState(1);
  const navigate = useNavigate();
  console.log(ticketInfo);
  console.log(allTicketTypes);

  React.useEffect(() => {
    console.log(venue)
    if (venue === 'Accor Stadium' || venue === 'Doltone House - Jones Bay Wharf'){
      setSeat(true)
    } else {
      setSeat(false)
    }
  },[venue])

  const handleImage2 = async (event) => {
    const image2Data = await fileToDataUrl(event.target.files[0]);
    setImage2(image2Data);
  };
  const handleImage3 = async (event) => {
    const image3Data = await fileToDataUrl(event.target.files[0]);
    setImage3(image3Data);
  };
  const handleThumbnail = async (event) => {
    const thumbnailData = await fileToDataUrl(event.target.files[0]);
    setThumbnail(thumbnailData);
  };

  const handleAmount = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.ticketAmount = event.target.value;
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };
  const handleTicketType = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.ticketType = event.target.value;
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };

  const handleTicketPrice = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.price = event.target.value;
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };

  const handleTicketSeatSection = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    if (event.target.checked) {
      allNewTicketTypes[index].seatSection.push(event.target.value);
    } else {
      // const oldSeatSection = allNewTicketTypes[index].seatSection;
      // oldSeatSection.remove(event.target.value);
      // const updateSeatSection = oldSeatSection;
      const updatedSeats = allNewTicketTypes[index].seatSection.filter((section) => !section.includes(event.target.value));
      allNewTicketTypes[index].seatSections = updatedSeats;
      //allNewTicketTypes[index].seatSection.remove(event.target.value);
    }
    setAllTicketTypes(allNewTicketTypes);
    console.log(allNewTicketTypes);
    
  }
  const handleAddTicket = (index) => {
    //setAllTicketTypes(prev => [...prev, ticketInfo]);

    // resetting the fields in ticketInfo
    const newTicketInfo = { ...ticketInfo };
    newTicketInfo.ticketType = '';
    newTicketInfo.ticketAmount = '';
    newTicketInfo.price = '';
    newTicketInfo.seatSections = [];
    // setTicketInfo(newTicketInfo);
    setAllTicketTypes((prev) => [...prev, newTicketInfo]);
    console.log(allTicketTypes);
  };

  const handleVenue = (event) => {
    setVenue(event);
    console.log(event);
    if (event === 'Other') {
      setOther(true);
    } else {
      setOther(false);
    }
  };

  const handleSeat = (event) => {
    setSeat(event);
  };
  const handleSubmit = async () => {
    // const resultStart = start.map(item => item.toLocaleDateString());
    // const resultEnd = end.map(item => item.toLocaleDateString());
    // setting errors back to default
    setEndTimeError(false); // End time before start time error
    setNegCapacityError(false); // capacity < 0
    setStartTimeError(false); // start time is before the current time 
    setInsufCapacityError(false); // venue capacity < total tickets
    console.log(thumbnail);
    console.log(localStorage.getItem('token'));
    console.log(allTicketTypes);
    let jsonString = JSON.stringify({});
    if (other) {
      // add venue capacity
      jsonString = JSON.stringify({
        events: {
          eventName: eventName,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          eventDescription: eventDescription,
          eventType: eventType,
          eventLocation: eventLocation,
          eventVenue: venue,
          venueCapacity: venueCapacity,
          capacity: capacity,
          image1: thumbnail,
          image2: image2,
          image3: image3,
        },
        tickets: allTicketTypes,
      });
    } else {
      jsonString = JSON.stringify({
        events: {
          eventName: eventName,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          eventDescription: eventDescription,
          eventType: eventType,
          eventVenue: venue,
          capacity: capacity,
          image1: thumbnail,
          image2: image2,
          image3: image3,
        },
        tickets: allTicketTypes,
      });
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: jsonString,
    };
    const r = await fetch(
      `http://localhost:3000/events/create`,
      requestOptions
    );
    const json = await r.json();
    if (r.ok) {
      console.log(json);
      navigate('/');
    } else if (r.status === 400) {
      // alert the error code and the 
      if (json === "Invalid Starting and Finishing Times" ) {
        setEndTimeError(true)
      } else if (json === "Invalid Capacity" ) {
        setNegCapacityError(true);
      } else if (json === "Invalid Event Date") {
        setStartTimeError(true);
      } else if (json === "Capacity not sufficient") {
        setInsufCapacityError(true);
      }
    } 

  }

  const styles = {
    Paper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3vw',
      margin: '9vw',
    },
  };
  return (
    <Paper variant="elevation" square style={styles.Paper}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              Create Your Event
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="Event Name"
              label="Event Name"
              aria-label="Event Name"
              type="text"
              variant="outlined"
              onChange={(e) => setEventName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{ width: '35%' }}>
              <InputLabel id="Event type label">Event Type</InputLabel>
              <Select
                labelId="Event Type label"
                id="Event Type"
                label="Event Type"
                aria-label="Event Type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
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
          <Grid item xs={12}>
            <TextField
              id="Event Description"
              label="Event Description"
              aria-label="Event Description"
              type="text"
              variant="outlined"
              onChange={(e) => setEventDescription(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{ width: '35%' }}>
              <InputLabel id="eventVenue">Venue</InputLabel>
              <Select
                labelId="venue label"
                id="eventVenue"
                label="Event Type"
                aria-label="Event Type"
                value={venue}
                onChange={(e) => handleVenue(e.target.value)}
              >
                {/* do we need event types stored in the back end (maybe we need to when we filter?) */}
                <MenuItem value={'Accor Stadium'}>
                  Accor Stadium - capacity 83500
                </MenuItem>
                <MenuItem value={'ICC Sydney'}>
                  ICC Sydney - capacity 5000
                </MenuItem>
                <MenuItem value={'Ivy Precinct'}>
                  Ivy Precinct - capacity 1000
                </MenuItem>
                <MenuItem value={'Doltone House - Jones Bay Wharf'}>
                  Doltone House - Jones Bay Wharf - capacity 750
                </MenuItem>
                <MenuItem value={'UNSW Roundhouse'}>
                  UNSW Roundhouse - capacity 2200
                </MenuItem>
                <MenuItem value={'Other'}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {(!other && !seat) && (<>
            <Grid item xs={12}>
              <Typography variant="h6" component="div" color='red'>
                  Seating Unavailable
              </Typography>
            </Grid>
          </>)}
          {(!other && seat) && (<>
            <Grid item xs={12}>
              <Typography variant="h6" component="div" color='green'>
                  Seating Available
              </Typography>
            </Grid>
          </>)}
          {!other && (<>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onChange={(e) => handleSeat(e.target.checked)}
                  />
                }
                label="Seating Available"
              />
              {}
            </Grid> */}
            <DefaultVenueInfo venue={venue}/>
            <Grid item xs={12}>
              <Typography variant="h6" component="div">
                Event Capacity:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="Event Capacity"
                label="Event Capacity"
                aria-label="Event Capacity"
                type="text"
                variant="outlined"
                onChange={(e) => setCapacity(e.target.value)}
                fullWidth
              />
            </Grid>
            </>
          )}
          <>
            {other && (
              <>
                <Grid item xs={12}>
                  <TextField
                    id="Venue"
                    label="Venue"
                    aria-label="Venue"
                    type="text"
                    variant="outlined"
                    onChange={(e) => setVenue(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="Event Location"
                    label="Event Location"
                    aria-label="Event Location"
                    type="text"
                    variant="outlined"
                    onChange={(e) => setEventLocation(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="Capacity"
                    label="Venue Capacity"
                    aria-label="Capacity"
                    type="text"
                    variant="outlined"
                    onChange={(e) => setVenueCapacity(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="div">
                    Event Capacity:
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="Event Capacity"
                    label="Event Capacity"
                    aria-label="Event Capacity"
                    type="text"
                    variant="outlined"
                    onChange={(e) => setCapacity(e.target.value)}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      disabled
                      onChange={(e) => handleSeat(e.target.checked)}
                    />
                  }
                  label="Seating Available"
                /> */}
                <Typography variant="h6" component="div" color='red'>
                  Seating Unavailable
                </Typography>

                </Grid>
              </>
            )}
          </>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DateTimePicker
                  label="start date and time"
                  id="startPicker"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e)}
                  style={{ width: '35%' }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                  label="end date and time"
                  id="endPicker"
                  onChange={(e) => setEndDateTime(e)}
                  style={{ width: '35%' }}
                  value={endDateTime}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            {/* thumbnail is image 1 in the database */}
            <Typography variant="h6" component="div">
              {' '}
              upload a thumbnail
            </Typography>
            <input
              id="thumbnail"
              aria-label="thumbnailInput"
              type="file"
              onChange={handleThumbnail}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              {' '}
              upload a 2nd image
            </Typography>
            <input
              id="thumbnail"
              aria-label="thumbnailInput"
              type="file"
              onChange={handleImage2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              {' '}
              upload a 3rd image
            </Typography>
            <input
              id="thumbnail"
              aria-label="thumbnailInput"
              type="file"
              onChange={handleImage3}
            />
          </Grid>
          <Grid item xs={12}>
            {allTicketTypes.map((item, index) => {
              return (
                <div key={index}>
                  <TicketTypeInput
                    handleAmount={handleAmount}
                    handleTicketType={handleTicketType}
                    handleTicketPrice={handleTicketPrice}
                    handleTicketSeatSection={handleTicketSeatSection}
                    index={index}
                    venue={venue}
                  />
                </div>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" id="addButton" onClick={handleAddTicket}>
              {' '}
              Add More Ticket Types
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" id="addButton" onClick={handleSubmit}>
              {' '}
              Submit
            </Button>
          </Grid>
          <Grid item xs = {12}>
            {endTimeError === true
            ? (<Alert severity="error">Error, the End time before start time error</Alert>):null}
            {negCapacityError === true
            ? (<Alert severity="error">Error, the event capacity cannot be smaller than 0</Alert>):null}
            {startTimeError=== true
            ? (<Alert severity="error">Error, the event start time cannot be before the current time</Alert>):null}
            {insufCapacityError=== true
            ? (<Alert severity="error">Error, venue capacity is smaller than the tickets available</Alert>):null}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
export default CreateEventsForm;
