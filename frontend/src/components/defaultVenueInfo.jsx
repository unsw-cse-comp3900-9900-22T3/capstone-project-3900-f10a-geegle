import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Typography,
  Button,
  Checkbox,
  Stack,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import TicketTypeInput from './TicketTypeInput';
import FormControlLabel from '@mui/material/FormControlLabel';
const DefaultVenueInfo = (venue) => {
  const [venueLocation, setVenueLocation] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');


  React.useEffect(() => {
    console.log(venue.venue)
    if (venue.venue === 'Accor Stadium') {
      console.log('here')
      setVenueLocation('Edwin Flack Ave, Sydney Olympic Park NSW 2127')
      setVenueCapacity('83500')
    } else if (venue.venue === 'ICC Sydney') {
      setVenueLocation('14 Darling Dr, Sydney NSW 2000')
      setVenueCapacity('5000')
    } else if (venue.venue === 'Ivy Precinct') {
      setVenueLocation('330 George St, Sydney NSW 2000')
      setVenueCapacity('1000')
    } else if (venue.venue === 'Doltone House - Jones Bay Wharf') {
      setVenueLocation('level 3/26-32 Pirrama Rd, Pyrmont NSW 2009')
      setVenueCapacity('750')
    } else if (venue.venue === 'UNSW Roundhouse') {
      setVenueLocation('Roundhouse (E6), Anzac Parade, UNSW Sydney, Kensington NSW 2052')
      setVenueCapacity('2200')
    }
  },[venue.venue])
  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Event Location:
          </Typography>
        </Grid>
        <TextField
          disabled
          id="Event Location"
          // label="Event Location"
          aria-label="Event Location"
          type="text"
          variant="outlined"
          value = {venueLocation}
          variant="filled"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="div">
          Venue Capacity:
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          disabled
          id="Capacity"
          // label="Capacity"
          aria-label="Capacity"
          type="text"
          variant="outlined"
          value={venueCapacity}
          variant="filled"
          fullWidth
        />
      </Grid>
    </>
  )
}
export default DefaultVenueInfo;