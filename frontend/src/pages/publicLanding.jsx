import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchFilter from '../components/searchFilter';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import FilteredListings from '../components/FilteredListings';
import PublishedCard from '../components/PublishedCard';

// button styles
const SearchButton = styled(Button)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
  width: '15%',
  margin: '1%'
});

const UnFilterButton = styled(Button)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
  width: '15%',
  margin: '1%'
});


/**
 * Component that renders the home page/ public landing 
 * page of eventful 
 */
const PublicLanding = () => {
  const [allListings, setAllListings] = React.useState([]);
  const [upcomingListings, setUpcomingListings] = React.useState([]);
  const [soldOut, setSoldOut] = React.useState([]);
  const [recommended, setRecommended] = React.useState([]);
  const [toggleState, setToggleState] = React.useState('All Events');
  const [openSearch, setOpenSearch] = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const navigate = useNavigate();

 
  const fetchSoldOut = async () => {
    
    const response = await fetch(`http://localhost:3000/events/soldOut`, {
      method: 'GET',
    })
    const eventJson = (await response.json()).events;
    setSoldOut([...eventJson]);
      
  }
  const fetchAllEvents = async () => {
    
    const response = await fetch(`http://localhost:3000/events/all`, {
      method: 'GET',
    })
    const json = (await response.json()).events;
    setAllListings([...json])
  }
  
  const fetchUpcomingEvents = async () => {
    
    const response = await fetch(`http://localhost:3000/events/upcoming`, {
      method: 'GET'
    })
    const json = (await response.json()).events;
    setUpcomingListings(json);
  }

  const fetchRecommended = async() => {
    const response = await fetch(`http://localhost:3000/events/recommended`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },

    })
    
    const eventJson = (await response.json()).events;
    setRecommended([...eventJson]);
  }

  /**
   * Function that determine what tab is the user is
   * on when they are on the public landing page
   * Different tabs will display different events
   */
  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    if (newAlignment === "Upcoming Events") {
      fetchUpcomingEvents();
    } else if (newAlignment === "All Events") {
      fetchAllEvents();
    } else if (newAlignment === "Sold Out") {
      fetchSoldOut();
    } else if (newAlignment === "For You") {
      fetchRecommended();
    }
    
  };
  const handleUnfilter = () => {
    setFilter(false);
    navigate('/');

  }
  // upon entering the page
  // we fetch all events 
  React.useEffect(() => {
    fetchAllEvents();
  }, []);
  
  return (
    <Grid container spacing={1} style={{padding: "3.2rem"}}>
      {!filter && <Grid item xs={12}>
        <SearchButton onClick={()=>setOpenSearch(true)}>Search/Filter</SearchButton>
      </Grid>}
      {filter && <Grid item xs={12}>
        <UnFilterButton onClick={()=>handleUnfilter()}>UnFilter</UnFilterButton>
      </Grid>}
      {openSearch && <SearchFilter openSearch={openSearch} setOpenSearch={setOpenSearch} setFilter={setFilter} setFilteredListings={setFilteredListings}></SearchFilter>}
      <Grid item xs={12}>
        <Box>
          {!filter ? (
            <ToggleButtonGroup
            color="primary"
            value={toggleState}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="All Events">All Events</ToggleButton>
            <ToggleButton value="Upcoming Events">Upcoming Events</ToggleButton>
            <ToggleButton value="Sold Out">Sold Out</ToggleButton>
            {localStorage.getItem('token') !== null ? (
              <ToggleButton value="For You">For You</ToggleButton>
            ):null}
            
          </ToggleButtonGroup>
          ): null}
        </Box>
      </Grid>
      <Grid item xs= {12}>
        <Grid container spacing={6}>
          {filter && <FilteredListings filteredListings={filteredListings}/>}
          {(!filter && toggleState === 'All Events') && (
            allListings.map((obj, idx) => {
              return (
                <PublishedCard eventObj ={obj} idx={idx} />
              )
            })
          )}
          {(!filter && toggleState === 'Upcoming Events') && 
            upcomingListings.map((obj, idx) => {
            return (
              <PublishedCard eventObj ={obj} idx={idx} />
            )}
          )}
          {(!filter && toggleState === 'Sold Out') && 
            soldOut.map((obj, idx) => {
            return (
              <PublishedCard eventObj ={obj} idx={idx} />
            )}
          )}
          {(!filter && toggleState === 'For You') && 
            recommended.map((obj, idx) => {
            return (
              <PublishedCard eventObj ={obj} idx={idx} />
            )}
          )}
        </Grid>
      </Grid>
    </Grid>
    
  );
};
export default PublicLanding ;