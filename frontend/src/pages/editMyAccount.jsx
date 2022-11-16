import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * Component that renders Edit my account form, when user clicks on their profile
 */
const EditMyAccount = () => {
  const [open, setOpen] = React.useState(true);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [creditCardNum, setCreditCardNum] = React.useState('');
  const [ccv, setCCV] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const navigate = useNavigate();
  const handleClose = () => {
    navigate('/user/profile');
    setOpen(false);
  }
  const fetchUserDetails = async () => {
    if (localStorage.getItem('token')) {
      const response = await fetch(`http://localhost:3000/user/profile/${localStorage.getItem('userId')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      if (json.user.firstName === null) {
        setFirstName('Not Specified');
      } else {
        setFirstName(json.user.firstName);
      }
      
      setLastName(json.user.lastname);
      setEmail(json.user.email);

      
      setCreditCardNum(json.user.creditCard.creditCardNum);
      setCCV(json.user.creditCard.ccv);
      setMonth(json.user.creditCard.expiryMonth);
      setYear(json.user.creditCard.expiryYear);
    }
  }

     // upon entering the page
  React.useEffect(() => {
    // fetch bookings if token is available
    fetchUserDetails();
  }, []);
  
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Your Payment Details:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            First Name : {firstName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Last Name : {lastName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Email: {email}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Payment Details: <Button size="small">edit</Button>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Credit card Number: {creditCardNum}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            CCV: {ccv}
            <Button size="small">edit</Button>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Month: {month}
            <Button size="small">edit</Button>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Year: {year}
            <Button size="small">edit</Button>
          </Typography>



        </Box>
      </Modal>
    </>
  );
};
export default EditMyAccount;