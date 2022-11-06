import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';
import AccorStadium from '../components/AccorStadium';
import DoltonHouse from '../components/DoltonHouse';


const ViewCustomers= ({
  customerModal, 
  clickedEventInfo, 
  setCustomerModal
  }) => {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70vw',
      height: '70vh',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  // console.log(clickedEventInfo);
  const [customers, setCustomers] = useState([]);
  const fetchCustomers = async() => {
    // console.log('event id', clickedEventInfo.eventID);
    const response = await fetch(`http://localhost:3000/events/${clickedEventInfo.eventID}/guest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    
    const json = (await response.json()).guests;
    setCustomers(json);
  }
  useEffect(()=> {
    fetchCustomers();
  },[])
  return (   
    <Modal
      open={customerModal}
      onClose={()=>setCustomerModal(false)}
      aria-labelledby="view customers"
      aria-describedby="view customer details"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{mb:2}}>
         Customers for {clickedEventInfo.eventName}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Name
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              Email
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
              No. Tickets
            </Typography>
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
        < Grid container spacing={1} style={{overflow:'auto', height: '70%'}}>
          {customers.map((c, index) => {
            return (
              <Grid container spacing = {1} style={{padding:'8px'}}>
                <Grid item xs={3}>
                  <Typography variant="h6" color="text.secondary">
                    {c.name}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" color="text.secondary">
                    {c.email}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" color="text.secondary">
                    qty of tickets
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button 
                    variant="contained"
                   >
                      View Tickets
                  </Button>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
        <Box id= "send email button container"  style={{textAlign:'center'}}>
          <Button 
            variant="contained"
            style={{textAlign:'center'}}
            >
            Send email to all attendees
          </Button>
        </Box>
        <Button 
            variant="text"
            >
              Close
          </Button>
        
      </Box>
    </Modal>
   
  );
};
export default ViewCustomers;