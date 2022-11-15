import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
  width: "50vw",
  height: '50vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'scroll',
  p: 4,
};

const SearchFilter = ({openSearch, setOpenSearch, setFilter, setFilteredListings}) => {
  //const [open, setOpen] = React.useState(true);
  const [openStartDate, setOpenStartDate] = React.useState(false);
  const[openEndDate, setOpenEndDate] = React.useState(false);
  const [openEventCat, setOpenEventCat] = React.useState(false);
  const [openEventLoc, setOpenEventLoc] = React.useState(false);
  const [openEventRating, setOpenEventRating] = React.useState(false);
  const [openEventCost, setOpenEventCost] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date().toISOString());
  const [endDate, setEndDate] = React.useState(new Date().toISOString());
  const [eventType, setEventType] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');
  const [eventRating, setEventRating] = React.useState('');
  const [eventCost, setEventCost] = React.useState('');
  const [keyword, setKeyword] = React.useState('');
  const [searchString,setSearchString] = React.useState([false,false,false,false,false,false,false]);
  const navigate = useNavigate();
  const handleClose = () => {
    navigate('/');
    //navigate(`/event/view/${eventId}`);
    setOpenSearch(false);
  };
  const handleStartOpen = (event) => {
    setOpenStartDate(event);
    let updatedList = [...searchString]
    updatedList[1] = event;
    setSearchString(updatedList);
  };
  const handleEndOpen = (event) => {
    setOpenEndDate(event);
    let updatedList = [...searchString]
    updatedList[2] = event;
    setSearchString(updatedList);
  };
  const handleEventCatOpen = (event) => {
    setOpenEventCat(event);
    let updatedList = [...searchString]
    updatedList[3] = event;
    setSearchString(updatedList);
  };
  const handleEventRatingOpen =(event) => {
    setOpenEventRating(event);
    let updatedList = [...searchString]
    updatedList[5] = event;
    setSearchString(updatedList);
  }
  const handleEventCostOpen =(event) => {
    setOpenEventCost(event);
    let updatedList = [...searchString]
    updatedList[6] = event;
    setSearchString(updatedList);
  }
  const handleEventLocOpen =(event) => {
    setOpenEventLoc(event);
    let updatedList = [...searchString]
    updatedList[4] = event;
    setSearchString(updatedList);
  }

  const updateEventCost = (event) => {
    if (event.target.value !== '') {
      setEventCost(parseInt(event.target.value))
    }
  }

  // check if a string is only spaces https://bobbyhadz.com/blog/javascript-check-if-string-contains-only-spaces
  const onlySpaces=(str) => {
    return str.trim().length === 0;
  }

  const handleKeyword = (e) => {
    console.log('here');
    console.log('keyword', keyword);
    setKeyword(e.target.value);
    let updatedList = [...searchString];
    if(!onlySpaces(e.target.value)) {
      updatedList[0] = true;
    } else {
      updatedList[0] = false;
    }
    setSearchString(updatedList);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('submitted!');
    // add an if statement to check if fields are filled in
    let combinedStr = '';
    let concatStr = '';
    console.log(searchString);
    searchString.forEach((elem, idx) => {
      if(elem) {
        switch(idx) {
          case 0:
            concatStr=`searchWords=${keyword.replace(/ /g, '%20')}`;
            break;
          case 1:
            concatStr=`from=${startDate}`;
            break;
          case 2:
            concatStr=`to=${endDate}`;
            break;
          case 3:
            concatStr=`category=${eventType.replace(/ /g, '%20')}`;
            break;
          case 4:
            concatStr=`location=${eventLocation.replace(/ /g, '%20')}`;
            break;
          case 5:
            concatStr=`rating=${eventRating}`;
            break;
          case 6:
            concatStr=`priceLimit=${eventCost}`;
            break;
        }
        combinedStr=combinedStr+concatStr+'&'
      }
    })
    // check last character is it's and &
    if (combinedStr.length !== 0) {
      console.log('here')
      combinedStr=combinedStr.slice(0, -1);
    }
    console.log(combinedStr);
    // calling api
    if(!localStorage.getItem('token')) {
      const response = await fetch(`http://localhost:3000/events/find?${combinedStr}`, {
      method: 'GET'
    })
      const json = await response.json();
      if (response.ok) {
        console.log('result', json);
        handleClose();
        setFilter(true);
        setFilteredListings(json.events);
      }
    } else {
      const response = await fetch(`http://localhost:3000/events/find?${combinedStr}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      }})
      const json = await response.json();
      if (response.ok) {
        console.log('result', json);
        handleClose();
        setFilter(true);
        setFilteredListings(json.events);
      }

    }
  }
  

  console.log(startDate);
  console.log(endDate);
  console.log(eventType);
  // console.log(filteredListings);
  return (
    <>
      <Modal
        open={openSearch}
        onClose={handleClose}
        aria-labelledby="host-profile-modal"
        aria-describedby="host rating and reviews"
        arial-modal={true}
      >
        <form onSubmit={(e)=>handleSubmit(e)}>
          <Box sx={style}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "60vw" }}
            >
              <SearchIcon />
              <Typography variant="h6" component="div">
                Search By Keyword:
              </Typography>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="event name, description or type"
                inputProps={{ 'aria-label': 'search with keyword' }}
                onChange={(e)=>handleKeyword(e)}
              />
            </Paper>
            <Typography variant="h6" component="div">
              Filters:
            </Typography>
            <Box>
              <FormControlLabel control={<Checkbox onChange={(e) => handleStartOpen(e.target.checked)}/>} label="Start Date" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleEndOpen(e.target.checked)}/>} label="End Date" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleEventCatOpen(e.target.checked)}/>} label="Event Category" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleEventLocOpen(e.target.checked)}/>} label="Event Location" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleEventRatingOpen(e.target.checked)}/>} label="Event Rating" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleEventCostOpen(e.target.checked)}/>} label="Maximum Ticket Price" />
            </Box>
            {openStartDate && 
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DateTimePicker
                      label="start date and time"
                      id="startPicker"
                      value={startDate}
                      onChange={(e) => setStartDate(e.toISOString())}
                      // style={{ width: '35%' }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
            }
            {openEndDate && 
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DateTimePicker
                        label="End date and time"
                        id="endPicker"
                        value={endDate}
                        onChange={(e) => setEndDate(e.toISOString())}
                        // style={{ width: '35%' }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                  </Stack>
                </LocalizationProvider>
              </Grid>
            }
            {openEventCat && 
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
            }
            {openEventLoc && 
              <Grid item xs={12}>
                <FormControl style={{ width: '35%' }}>
                  <InputLabel id="Event location label">Event Location</InputLabel>
                  <Select
                    labelId="Event Location label"
                    id="Event Location"
                    label="Event Location"
                    aria-label="Event Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                  >
                    {/* do we need event types stored in the back end (maybe we need to when we filter?) */}
                    <MenuItem value={'Accor Stadium'}>Accor Stadium</MenuItem>
                    <MenuItem value={'ICC Sydney'}>ICC Sydney</MenuItem>
                    <MenuItem value={'Ivy Precinct'}>Ivy Precinct</MenuItem>
                    <MenuItem value={'Doltone House - Jones Bay Wharf'}>Doltone House - Jones Bay Wharf</MenuItem>
                    <MenuItem value={'UNSW Roundhouse'}>UNSW Roundhouse</MenuItem>
                    <MenuItem value={'Other'}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            }
            {openEventRating && 
              <Grid item xs={12}>
                <FormControl style={{ width: '35%' }}>
                  <InputLabel id="Event Rating label">Event Rating Equivalent or Higher</InputLabel>
                  <Select
                    labelId="Event Rating label"
                    id="Event Rating"
                    label="Event Rating"
                    aria-label="Event Rating"
                    value={eventRating}
                    onChange={(e) => setEventRating(e.target.value)}
                  >
                    <MenuItem value={'1'}>1</MenuItem>
                    <MenuItem value={'2'}>2</MenuItem>
                    <MenuItem value={'3'}>3</MenuItem>
                    <MenuItem value={'4'}>4</MenuItem>
                    <MenuItem value={'5'}>5</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            }
            {openEventCost && 
              <Grid item xs={12}>
                <TextField
                  aria-label="Cost Input"
                  placeholder='$AUD'
                  onChange={e => updateEventCost(e)}
                  id="eventCost"
                  label="eventCost"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            }
            <Button type="submit" value="submit" onClick={(e)=>handleSubmit(e)}>Submit</Button>
          </Box>
          
        </form>
      </Modal>
    </>
  );
};
export default SearchFilter;
