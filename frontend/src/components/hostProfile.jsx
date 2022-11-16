/* eslint-disable */ 
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vh',
  height: '50vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'scroll',
  p: 4,
};

/**
 *  Functional component that renders 
 *  the profile of the host which would show host name, host email,
 *   average rating, and all events hosted/hosting (published events)
 */
const HostProfile=()=> {

  const [open, setOpen] = useState(true);
  const [hostInfo, setHostInfo] = useState({
    hostName: "",
    hostRating: 0,
    hostEmail:""
  });
  const [hostEvents, setHostEvents] = useState([]);
  const navigate = useNavigate();
  const {hostId} = useParams();
  const state = useLocation();
  const eventId = state.state;


  /**
   * Function that closes the host profile when user
   * want to close host profile
   */
  const handleClose = () => {
    navigate(`/event/view/${eventId}`);
    setOpen(false);
  };

  /**
   * Fetching host information
   */
  const fetchHostInfo = async() => {
    
    const response = await fetch(`http://localhost:3000/events/host/details/${hostId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json();
    setHostInfo(json)
    const allEvents = json.events;
    const hostPublishedEvent = allEvents.filter((ele,idx) => ele.published === true);
    setHostEvents(json.events);
  }

  /**
   *  This useEffect renders host information as soon as user lands on the host
   *  profile's page
   */
  useEffect(() => {
    fetchHostInfo();
  }, [])

  return(
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="host-profile-modal"
        aria-describedby="host rating and reviews"
        arial-modal={true}
      >
        <Box sx={style}>
          <Typography id="host description profile" variant="h6" component="h2">
            Host Profile
          </Typography>
          <Typography id="host description name" sx={{ mt: 2 }}>
            Host Name: {hostInfo.hostName}
          </Typography>
          <Typography id="host description rating" sx={{ mt: 2 }}>
            Host Rating: {parseFloat(hostInfo.hostRating).toFixed(2)}
          </Typography>
          <Typography id="host description rating email" sx={{ mt: 2 }}>
            Host Email: {hostInfo.hostEmail}
          </Typography>
          <Typography id="host description rating breakdown" variant="h6" component="h2">
            Host Event Rating Breakdown:
          </Typography>
          {hostEvents.map((obj,idx) => {
            return(
              <Card key={idx} sx={{ maxWidth: '100%' ,display: 'grid'}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  {obj.eventName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {`Start Date: ${obj.startDateTime.substring(0, 10)} End Date: ${obj.endDateTime.substring(0, 10)}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {`Event Venue: ${obj.eventVenue}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {`Number Of Reviews: ${obj.numReviews}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {`Event Score: ${obj.eventScore}`}
                  </Typography>
                  {Array(Math.ceil(obj.eventScore))
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        height="35"
                        width="35"
                        aria-label="coloured star rating"
                      >
                        <polygon
                          points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                          fill="#ffd800"
                        />
                      </svg>
                    ))}
                  {Array(5 - Math.ceil(obj.eventScore))
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        height="35"
                        width="35"
                        aria-label="uncoloured star rating"
                      >
                        <polygon
                          points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                          fill="#7e7e7e"
                          stroke="#7e7e7e"
                          strokeWidth="1"
                        />
                      </svg>
                    ))}
                </CardContent>
              </Card> 
          )})}
        </Box>
      </Modal>
    </>
  );
};
export default HostProfile;