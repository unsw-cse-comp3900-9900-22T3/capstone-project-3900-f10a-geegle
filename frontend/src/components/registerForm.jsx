import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const RegisterForm = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confPassword, setConfPassword] = React.useState('');
    const [payment, setPayment] = React.useState('');
    const [card, setCard] = React.useState(false);
    const [paypal, setPaypal] = React.useState(false);

      // holds the keywords that needs to be searched
    const handleCard = (e) => {
        setCard(e.target.checked);
        setPaypal(false);
  };

    // holds the keywords that needs to be searched
    const handlePaypal = (e) => {
        setPaypal(e.target.checked);
        setCard(false);
    };
  return (
    <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Log into Eventful
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
    <FormControl>
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Email:
        </Typography>
        <TextField
            required
            id="emailRego"
            placeholder='jane@email.com'
            onChange={e => setEmail(e)}
            type='email'
            aria-label="title text input"
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Password:
        </Typography>
        <TextField
            required
            id="passwordRego"
            placeholder="your password"
            onChange={e => setPassword(e)}
            type='password'
            aria-label="title text input"
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Confirm Password:
        </Typography>
        <TextField
            required
            id="confPassword"
            placeholder="confirm password"
            onChange={e => setConfPassword(e)}
            type='password'
            aria-label="title text input"
        />
        <RadioGroup
            aria-label="Select one below:"
            // defaultValue="keyword"
            name="radio-buttons-group"
        >
            <FormControlLabel
                value="credit card"
                control={<Radio />}
                label="credit card"
                onChange={(e) => handleCard(e)}
            />
            <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="paypal"
                onChange={(e) => handlePaypal(e)}
            />
        </RadioGroup>
        <>{card && <>
            (<Typography id="modal-modal-title" variant="h6" component="h2">
            Payment Details:
            </Typography>
            <TextField
                required
                id="paymentdetsRego"
                placeholder="your payment details"
                onChange={e => setPayment(e)}
                type='text'
                aria-label="title text input"
            /> ) </>}</>
        
        <button
          type="submit"
          id="loginSubmitRego"
          aria-label="submit login form"
          style = {{marginTop: "10%"}}
        >
          submit
        </button>
    </FormControl>
    </Typography>
  </Box>
  );
};
export default RegisterForm;