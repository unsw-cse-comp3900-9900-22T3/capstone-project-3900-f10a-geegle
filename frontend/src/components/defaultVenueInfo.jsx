import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Typography
} from '@mui/material';


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
          aria-label="Event Location"
          type="text"
          variant="filled"
          value = {venueLocation}
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
          aria-label="Capacity"
          type="text"
          variant="filled"
          value={venueCapacity}
          fullWidth
        />
      </Grid>
    </>
  )
}
export default DefaultVenueInfo;