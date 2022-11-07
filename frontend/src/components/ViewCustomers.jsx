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
import CustomerTickets from '../components/CustomerTickets';


// const CustomerTickets = ({
//   customerTicketInfo, 
//   setViewTicketModal,
//   viewTicketModal,
//   eventInfo
// }) => {
//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '50vw',
//     height: '50vh',
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   };
//   console.log('in function');
  
//   return (
    
//     <Modal
//       hideBackdrop
//       open={viewTicketModal}
//       onClose={()=>setViewTicketModal(false)}
//       aria-labelledby="view customer tickets"
//       aria-describedby="view customer tickets"
//     >
//       <Box sx={style}>
//         <Typography variant="h5" color="text.secondary">
//           Tickets purchased by {customerTicketInfo.name} for {eventInfo.eventName}
//         </Typography>
//         <Grid container spacing={1}>
//           <Grid item xs={3}>
//             <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
//               Ticket Type
//             </Typography>
//           </Grid>
//           <Grid item xs={3}>
//             <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
//               Price
//             </Typography>
//           </Grid>
//           <Grid item xs={3}>
//             <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
//               Seat Section
//             </Typography>
//           </Grid>
//           <Grid item xs={3}>
//             <Typography variant="h6" color="text.secondary" style={{fontWeight:'bold'}}>
//               Seat 
//             </Typography>
//           </Grid>
//         </Grid>
//         < Grid container spacing={1} style={{overflow:'auto', height: '70%'}}>
//           {(customerTicketInfo.tickets).map((c, index) => {
//             return (
//               <Grid container spacing = {1} style={{padding:'8px'}}>
//                 <Grid item xs={3}>
//                   <Typography variant="h6" color="text.secondary">
//                     {c.ticketType}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <Typography variant="h6" color="text.secondary">
//                     {c.price}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={3}>
//                   <Typography variant="h6" color="text.secondary">
//                     {c.seat.seatSection}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={3}>
//                   {(()=> {
//                     if(c.seat.seatRow !== null) {
//                       return (
//                         <Typography variant="h6" color="text.secondary">
//                           Row: {c.seat.seatRow}, seat No.: {c.seat.seatNo}
//                         </Typography>
//                       )
//                     } else {
//                       return (
//                         <Typography variant="h6" color="text.secondary">
//                           seat No.: {c.seat.seatNo}
//                         </Typography>
//                       )
//                     }
//                   })()}
//                 </Grid>
//               </Grid>
//             )
//           })}
//         </Grid>
//         <Button 
//             variant="text"
//             onClick= {()=>setViewTicketModal(false)}
//             >
//               Close
//         </Button>
        
//       </Box>
//     </Modal>
//   )
// }

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
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [clickedCustomer, setClickedCustomer] = useState({});
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
  const handleViewCustomerTickets = (customerTicketInfo) => {
    setViewTicketModal(true);
    setClickedCustomer(customerTicketInfo);
    // return (
    //   <CustomerTickets 
    //   customerTicketInfo = {customerTicketInfo}
    //   setViewTicketModal = {setViewTicketModal}
    //   viewTicketModal = {true}
    //   eventInfo = {clickedEventInfo} />
    // )

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
      </Box>
    </Modal>
   
  );
};
export default ViewCustomers;