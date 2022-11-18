
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

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
 * displays my account information and allows user to edit their details
 */
const MyAccount = () => {
  const [open, setOpen] = React.useState(true);
  const [edit, setEdit] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [creditCardNum, setCreditCardNum] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [year, setYear] = React.useState('');
  const [editNum, setEditNum] = React.useState('');
  const [editCCV, setEditCCV] = React.useState('');
  const [editYear, setEditYear] = React.useState('');
  const [editMonth, setEditMonth] = React.useState('');
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
    setOpen(false);
  }

  const handleEdit = () => {
    setEdit(true);
  }

  const closeEdit = () => {
    setEdit(false);
  }
  const handleSubmit = async() => {
    if (editNum === '') {
      setEditNum(null);
    }
    if (editCCV === '') {
      setEditCCV(null);
    }

    if (editYear === '') {
      setEditYear(null);
    }

    if (editMonth === '') {
      setEditMonth(null);
    }
    const response = await fetch(`http://localhost:3000/user/profile/${localStorage.getItem('userId')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        "firstName": null,
        "lastName": null,
        "email": null,
        "password": null,
        "creditCard": {
            "creditCardNum": editNum,
            "ccv": editCCV,
            "expiryMonth": editMonth,
            "expiryYear": editYear
        }
      }),
    });
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      setEdit(false);
      fetchUserDetails();
    }
    
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
      console.log(json);
      if (json.user.firstName === null) {
        setFirstName('Not Specified');
      } else {
        setFirstName(json.user.firstName);
      }
      
      setLastName(json.user.lastname);
      setEmail(json.user.email);

      if (json.user.creditCard !== undefined) {
        const unencryptedNum = json.user.creditCard.creditCardNum;
        const encryptedNum = `xxxxxxxxxxxx${unencryptedNum.substr(unencryptedNum.length-4)}`;
        setCreditCardNum(encryptedNum);
        setMonth(json.user.creditCard.expiryMonth);
        setYear(json.user.creditCard.expiryYear);
      }
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
            Your Account Details:
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
          <>
            {!edit && <Typography id="modal-modal-title" variant="h6" component="h2">
              Payment Details:<Button size="small" onClick = {handleEdit}>edit</Button>
            </Typography>}
          </>
          <>
            {!edit && <> <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Credit card Number: {creditCardNum}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Expiry Month: {month}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Expiry Year: {year}
            </Typography></>}
          </>
          <>
          {edit && <FormControl>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Payment details (all fields required)
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Credit card Number:
          </Typography>
          <TextField
              required
              id="editNumber"
              placeholder=''
              onChange={e => setEditNum(e.target.value)}
              type='text'
              aria-label="title text input"
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
          CCV:
          </Typography>
          <TextField
              required
              id="editCCV"
              placeholder=""
              onChange={e => setEditCCV(e.target.value)}
              type='text'
              aria-label="title text input"
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Expiry Month:
          </Typography>
          <TextField
              required
              id="editMonth"
              placeholder=""
              onChange={e => setEditMonth(e.target.value)}
              type='text'
              aria-label="title text input"
          />
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Expiry Year:
          </Typography>
          <TextField
              required
              id="editYear"
              placeholder=""
              onChange={e => setEditYear(e.target.value)}
              type='text'
              aria-label="title text input"
          />
          <button
            type="submit"
            id="loginSubmit"
            aria-label="submit login form"
            onClick = {handleSubmit}
            style = {{marginTop: "10%"}}
          >
            submit
          </button>
          <button
            id="loginSubmit"
            aria-label="submit login form"
            onClick = {closeEdit}
            style = {{marginTop: "10%"}}
          >
            close
          </button>
          
    </FormControl>}</>
          



        </Box>
      </Modal>
    </>
  );
};
export default MyAccount;