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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
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
  width: 800,
  height: '50vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'scroll',
  p: 4,
};

const SearchFilter = () => {
  const [open, setOpen] = React.useState(true);
  const [openStartDate, setOpenStartDate] = React.useState(false);
  const[openEndDate, setOpenEndDate] = React.useState(false);
  const [openEventCat, setOpenEventCat] = React.useState(false);
  const [openEventLoc, setOpenEventLoc] = React.useState(false);
  const [openEventRating, setOpenEventRating] = React.useState(false);
  const [openEventCost, setOpenEventCost] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date().toISOString().substring(0, 11));
  const [endDate, setEndDate] = React.useState(new Date().toISOString().substring(0, 11));
  const [eventType, setEventType] = React.useState('');
  const navigate = useNavigate();
  const handleClose = () => {
    navigate('/');
    //navigate(`/event/view/${eventId}`);
    setOpen(false);
  };
  const handleStartOpen = (event) => {
    setOpenStartDate(event);
  };
  const handleEndOpen = (event) => {
    setOpenEndDate(event);
  };
  const handleEventCatOpen = (event) => {
    setOpenEventCat(event);
  };
  const handleEventRatingOpen =(event) => {
    setOpenEventRating(event);
  }
  const handleEventCostOpen =(event) => {
    setOpenEventCost(event);
  }

  const handleEventLocOpen =(event) => {
    setOpenEventLoc(event);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="host-profile-modal"
        aria-describedby="host rating and reviews"
        arial-modal={true}
      >
        <form>
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
              <FormControlLabel control={<Checkbox onChange={(e) => handleEventCostOpen(e.target.checked)}/>} label="Cost" />
            </Box>
            {openStartDate && 
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={startDate}
                    onChange={(e)=>setStartDate(e)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            }
            {openEndDate && 
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="MM/DD/YYYY"
                    value={endDate}
                    onChange={(e)=>setEndDate(e)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
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

            <Button>Submit</Button>
          </Box>
        </form>
      </Modal>
    </>
  );
};
export default SearchFilter;
