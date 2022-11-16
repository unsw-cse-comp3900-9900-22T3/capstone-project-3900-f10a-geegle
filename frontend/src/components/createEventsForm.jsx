/* eslint-disable */ 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Button, Stack, Paper, Alert } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TicketTypeInput from './TicketTypeInput';
import DefaultVenueInfo from './defaultVenueInfo';

/**
 * Reference: https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
 * The function below converts an image into base 64 string
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

/**
 * The component CreateEventsForm renders the create
 * page for eventful
 */
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
  const [ownVenue, setOwnVenue] = useState('');
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
  const [eventCapacityError, setEventCapacityError] = useState(false); // capacity < 0
  const [startTimeError, setStartTimeError] = useState(false); // start time is before the current time 
  const [insufCapacityError, setInsufCapacityError] = useState(false); // event capacity venue capacity < total tickets
  const [venueCapacityError, setVenueCapacityError] = useState(false); // venue capacity < Event Capacity
  const [noTicketErr, setNoTicketErr] = useState(false); // the event must at least have 1 ticket type group
  const [eventNameError, setEventNameError]= useState(false); // eventName cannot be empty
  const [eventDesErr, setEventDesErr] = useState(false); // event description cannot be empty
  // invalidTicketErr occurs ticket type must is an empty string, 
  // ticket quantity < 0 and ticket price < 0
  const [invalidTicketErr, setInvalidTicketErr] = useState(false);  
  const [thumbnailErr, setThumbnailErr] = useState(false); // event needs to have a thumbnail
  const [venueError, setVenueError] = useState(false); // venue must be specified 
  const [locationError, setLocationError] = useState(false); // location must be specifield
  const [empEventCapErr, setEmpEventCapErr] = useState(false); // event capacity cannot be empty
  const [empVenueCapErr, setEmpVenueCapErr] = useState(false); // venue capacity cannot be empty
  const [eventTypeErr, setEventTypeErr] = useState(false); // event type must be defined

  const [ticketInput, setTicketInput] = useState(1);
  const navigate = useNavigate();
 

  /**
   *  useEffect used to reset seat availability option in the form 
   */
  React.useEffect(() => {
    if (venue === 'Accor Stadium' || venue === 'Doltone House - Jones Bay Wharf'){
      setSeat(true)
    } else {
      setSeat(false)
    }
  },[venue])

  /**
   *  Function that sets image2 when it is selected
   */
  const handleImage2 = async (event) => {
    const image2Data = await fileToDataUrl(event.target.files[0]);
    setImage2(image2Data);
  };

   /**
   *  Function that sets image3 when it is selected
   */
  const handleImage3 = async (event) => {
    const image3Data = await fileToDataUrl(event.target.files[0]);
    setImage3(image3Data);
  };

  /**
   *  Function that sets thumbnail when it is selected
   */
  const handleThumbnail = async (event) => {
    const thumbnailData = await fileToDataUrl(event.target.files[0]);
    setThumbnail(thumbnailData);
  };

  /**
   * Function that sets/resets quantity of a ticket type when quanitity is changed
   */
  const handleAmount = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.ticketAmount = parseInt(event.target.value);
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };

  /**
   * Function that sets/resets type name of a ticket type when it is changed
   */
  const handleTicketType = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.ticketType = event.target.value;
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };

  /**
   * Function that sets/resets price of a ticket type when it is changed
   */
  const handleTicketPrice = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    newTicketInfo.price = event.target.value;
    allNewTicketTypes[index] = newTicketInfo;
    setTicketInfo(newTicketInfo);
    setAllTicketTypes(allNewTicketTypes);
  };

  /**
   *  Function that handles changes when user selected a seat section for a ticket type
   */
  const handleTicketSeatSection = (index, event) => {
    const newTicketInfo = { ...ticketInfo };
    const allNewTicketTypes = [...allTicketTypes];
    if (event.target.checked) {
      allNewTicketTypes[index].seatSections.push(event.target.value);
    } else {
      const updatedSeats = allNewTicketTypes[index].seatSections.filter((section) => section !== event.target.value);
      allNewTicketTypes[index].seatSections = updatedSeats;
    }
    setAllTicketTypes(allNewTicketTypes);  
  }

  /**
   *  Function that adds a new ticket type, quanitity and price 
   *  field everytime when "Add Ticket" button is clicked
   */
  const handleAddTicket = (index) => {
    const newTicketInfo = {  
      ticketType: '',
      ticketAmount:'',
      price:'',
      seatSections: []
    }
    setTicketInfo(newTicketInfo);
    setAllTicketTypes((prev) => [...prev, newTicketInfo]);
  };

  /**
   *  Function that handles venue changes from the drop down
   */
  const handleVenue = (event) => {
    setVenue(event);
    if (event === 'Other') {
      setOther(true);
    } else {
      setOther(false);
    }
  };

  /**
   * Function that error checks the form to make sure everything is filled in 
   * in the create events form. If no errors are present in the form, the event is 
   * successfully created and directs user to the home page 
   * - All fields are required in the create events form except for image 2 and image 3
   * - Form must have at least 1 ticket type group
   * - quanities are rounded down to the nearest whole number if quantity is a decimal
   * - error checks for decimals in venue capacity and event capacity 
   * - error checks for number inputs to be not below 0
   * - more error description below
   */
  const handleSubmit = async () => {
    console.log(venueCapacity);
    console.log(capacity);
    // setting errors back to default
    setEndTimeError(false); // End time before start time error
    setEventCapacityError(false); // capacity < 0 or if capacity is a decimal 
    setStartTimeError(false); // start time is before the current time 
    setInsufCapacityError(false); // venue capacity < total tickets

    setVenueCapacityError(false); // venue capacity < Event Capacity
    setNoTicketErr(false); // the event must at least have 1 ticket type group
    setEventNameError(false); // eventName cannot be empty
    setEventDesErr(false); // event description cannot be empty
    setInvalidTicketErr(false);  // qty and price is neg or dec or an empty field in ticket type

    setThumbnailErr(false); // event needs to have a thumbnail
    setVenueError(false); // venue must be specified 
    setLocationError(false); // location must be specifield
    setEmpEventCapErr(false); // event capacity cannot be empty
    setEmpVenueCapErr(false); // venue capacity cannot be empty
    setEventTypeErr(false); // eventType must be defined

    if (thumbnail === "") {
      setThumbnailErr(true);
      return
    } else if (!other && venue === "") {
      setVenueError(true);
      return
    } else if (other && ownVenue === "") {
      setVenueError(true);
    } else if (other && eventLocation === "") {
      setLocationError(true);
      return
    } else if (capacity === "") {
      setEmpEventCapErr(true);
      return
    } else if (other && venueCapacity === "") {
      setEmpVenueCapErr(true);
      return
    } else if (eventType === "") {
      setEventTypeErr(true);
      return
    }

    let jsonString = JSON.stringify({});
    if (other) {
      console.log("here");
      jsonString = JSON.stringify({
        events: {
          eventName: eventName,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          eventDescription: eventDescription,
          eventType: eventType,
          eventLocation: eventLocation,
          eventVenue: ownVenue,
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
    console.log(jsonString);
    const r = await fetch(
      `http://localhost:3000/events/create`,
      requestOptions
    );
    const json = await r.json();
    if (r.ok) {
      navigate('/');
    } else if (r.status === 400) {
      if (json === "Invalid Starting and Finishing Times" ) {
        setEndTimeError(true)
      } else if (json === "Invalid Capacity" ) {
        setEventCapacityError(true);
      } else if (json === "Invalid Event Date") {
        setStartTimeError(true);
      } else if (json === "Capacity not sufficient") {
        setInsufCapacityError(true);
      } else if (json === "Venue capacity not sufficient for event") {
        setVenueCapacityError(true)
      } else if (json === "Event name cannot be empty") {
        setEventNameError(true);
      } else if (json === "Event description cannot be empty") {
        setEventDesErr(true);
      } else if (json === "Event must have tickets") {
        setNoTicketErr(true); 
      } else if (json === "Invalid ticket") {
        setInvalidTicketErr(true)
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
              required
              multiline
              id="Event Description"
              onChange = {(e) => setEventDescription(e.target.value)}
              rows = {7}
              placeholder = "Event Description"
              style ={{marginTop: '8px'}}
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
                type="number"
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
                    onChange={(e) => setOwnVenue(e.target.value)}
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
                    type="number"
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
                    type="number"
                    variant="outlined"
                    onChange={(e) => setCapacity(e.target.value)}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12}>
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
              upload a 2nd image (optional)
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
              upload a 3rd image (optional)
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
            {eventCapacityError === true
            ? (<Alert severity="error">Error, the event capacity cannot be smaller than 0 or a decimal</Alert>):null}
            {startTimeError=== true
            ? (<Alert severity="error">Error, the event start time cannot be before the current time</Alert>):null}
            {insufCapacityError=== true
            ? (<Alert severity="error">Error, event capacity is smaller than the tickets available</Alert>):null}
            {thumbnailErr === true 
            ? (<Alert severity="error">event must have a thumbnail</Alert>): null}
            {venueError === true 
            ? (<Alert severity="error">event must have a venue</Alert>): null}
            {locationError === true 
            ? (<Alert severity="error">event must have a location</Alert>): null}
            {empEventCapErr === true 
            ? (<Alert severity="error">event must have an event capacity</Alert>): null}
            {empVenueCapErr === true 
            ? (<Alert severity="error">event must have a venue capacity</Alert>): null}
            {eventTypeErr === true 
            ? (<Alert severity="error">event must have an event type</Alert>): null}
            {venueCapacityError === true 
            ? (<Alert severity="error">Error, venue capacity not sifficient for the event, please specify a larger venue capacity</Alert>): null}
            {eventNameError=== true 
            ? (<Alert severity="error">Please specify an event name</Alert>): null}
            {eventDesErr=== true 
            ? (<Alert severity="error">Event must have a description</Alert>): null}
            {noTicketErr=== true 
            ? (<Alert severity="error">Event must have tickets</Alert>): null}
            {invalidTicketErr=== true 
            ? (<Alert severity="error">Ticket fields cannot be empty and make sure quanitites are greater than 0 (decimals are rounded down to the nearest whole number) and prices is greater or equal to $0</Alert>): null}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
export default CreateEventsForm;
