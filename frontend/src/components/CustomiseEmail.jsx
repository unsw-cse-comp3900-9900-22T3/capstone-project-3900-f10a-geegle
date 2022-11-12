import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, TextField,Alert } from '@mui/material';



const SuccessModal = ({
  setEmailModal,
  emailSuccess,
  setEmailSuccess,
  eventInfo,
  closeEmailModal

}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    height: '50vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
    alignItems: 'center',
    p: 4,
  };

  const handleSuccessClose = () => {
    setEmailSuccess(false);
    closeEmailModal();
  }

  return (
    <Modal
      hideBackdrop
      open={emailSuccess}
      onClose={()=>setEmailSuccess(false)}
      aria-labelledby="confirm email success modal"
    >
      <Box sx={style}>
        <Typography variant="h5" style={{color: 'green'}}>
          You have successfully sent an email to all attendees for "{eventInfo.eventName}""
        </Typography>
        <Button 
            variant="text"
            size="large"
            style={{fontSize:'1.07rem'}}
            onClick = {()=>handleSuccessClose()}
            >
              Close
        </Button>
      </Box>
    </Modal>
    
  )
}

/**
 * Function that that renders a pop up that allows customers to type an
 * announcement that will be sent via email
 */
const CustomiseEmail = ({
  setEmailModal,
  emailModal,
  eventInfo,
  customers
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    height: '50vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);
  const closeEmailModal = () => {
    setEmailModal(false);
  }
  const handleSend = async() => {
    const jsonString = JSON.stringify({
      subject: subject,
      announcement: emailContent
      
    });
    const response = await fetch(`http://localhost:3000/events/${eventInfo.eventID}/emailEventAnnouncement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: jsonString

    })

    if (response.ok) {
      setEmailSuccess(true);
    }
  }

  return (
    <Modal
      hideBackdrop
      open={emailModal}
      onClose={()=>setEmailModal(false)}
      aria-labelledby="Customise Email"
      closeAfterTransition
    >
      <Box sx={style}>
        <Typography variant="h6" color="text.secondary">
          Send email to all attendees
        </Typography>
        <FormControl sx={{height: '90%'}} fullWidth>
          <Typography variant="h5" color="text.secondary">
            To:
          </Typography>
          <TextField
            disabled
            id="email recievers"
            value= {`All Attendees (${customers.length})`}  
            variant="filled"
            />
          <Typography variant="h5" color="text.secondary" style ={{marginTop: '8px'}}>
            Subject:
          </Typography>
          <TextField
            required
            id="subject input"
            placeholder = "Add your subject"
            onChange = {(e)=>setSubject(e.target.value)}
            />
          <TextField
            required
            multiline
            id="message input"
            onChange = {(e)=>setEmailContent(e.target.value)}
            rows = {7}
            placeholder = "Add your message"
            style ={{marginTop: '20px'}}
            
            />
        
          <Button 
            variant="contained"
            style ={{width: '2rem', alignSelf: 'center', marginTop: '20px'}}
            onClick = {handleSend}
            >
              Send
          </Button>

        </FormControl>
        <Button 
            variant="text"
            onClick = {()=>setEmailModal(false)}
            >
              Close
        </Button>
        {emailSuccess=== true ? (
          <SuccessModal
            setEmailModal = {setEmailModal}
            emailSuccess = {emailSuccess}
            setEmailSuccess = {setEmailSuccess}
            eventInfo = {eventInfo}
            closeEmailModal = {closeEmailModal} />
          ): null}
        
      </Box>
    </Modal>
  )
}
export default CustomiseEmail;