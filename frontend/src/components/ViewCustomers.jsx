import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import CustomerTickets from '../components/CustomerTickets';
import CustomiseEmail from '../components/CustomiseEmail';

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
 
  const [customers, setCustomers] = useState([]);
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [clickedCustomer, setClickedCustomer] = useState({});
  const fetchCustomers = async() => {
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
  const handleViewCustomerTickets = (customerTicketInfo) => {
    setViewTicketModal(true);
    setClickedCustomer(customerTicketInfo);

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
        <Box style={{overflow:'auto', height: '70%'}}>
          < Grid container spacing={1}>
            {customers.map((c, index) => {
              return (
                <Grid container spacing = {1} style={{padding:'8px'}} key={index}>
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
                      {c.tickets.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Button 
                      variant="contained"
                      onClick= {()=>handleViewCustomerTickets(c)}
                    >
                        View Tickets
                    </Button>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </Box>
        
        <Box id= "send email button container"  style={{textAlign:'center'}}>
          <Button 
            variant="contained"
            style={{textAlign:'center'}}
            onClick = {()=> setEmailModal(true)}
            >
            Send email to all attendees
          </Button>
        </Box>
        <Button 
            variant="text"
            onClick = {()=>setCustomerModal(false)}
            >
              Close
        </Button>
        {viewTicketModal === true ? (
          <CustomerTickets 
          customerTicketInfo = {clickedCustomer}
          setViewTicketModal = {setViewTicketModal}
          viewTicketModal = {viewTicketModal}
          eventInfo = {clickedEventInfo} />
        ): null}
        {emailModal === true ? (
          <CustomiseEmail
          setEmailModal = {setEmailModal}
          emailModal = {emailModal}
          eventInfo= {clickedEventInfo}
          customers = {customers} />
        ): null}
      </Box>
    </Modal>
   
  );
};
export default ViewCustomers;