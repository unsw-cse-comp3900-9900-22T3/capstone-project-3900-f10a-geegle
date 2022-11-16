import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
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

/**
 *  Function component that returns the register form on the frontend and
 *  allows the user to register to eventful
 */
const RegisterForm = () => {
    const [emailVar, setEmail] = React.useState('');
    const [firstNameVar, setFirstName] = React.useState('');
    const [lastNameVar, setLastName] = React.useState('');
    const [passwordVar, setPassword] = React.useState('');
    const [confPasswordVar, setConfPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false); // check if password meets the minimum requirements
    const [emailError, setEmailError] = React.useState(false);
    const [confirmPwError, setConfirmPwError] = React.useState(false);
    const [userExistError, setUserExistError] = React.useState(false);
    const [registerSuccess, setRegisterSuccess] = React.useState(false);
    

    const handleSubmit = async (e) => {
      // reset all errors to default state 
      setPasswordError(false);
      setEmailError(false);
      setUserExistError(false);
      setRegisterSuccess(false);
      setConfirmPwError(false);

      e.preventDefault();
      
      const jsonString = JSON.stringify({
          firstName: firstNameVar.toLowerCase(),
          lastName: lastNameVar.toLowerCase(),
          email: emailVar.toLowerCase(),
          password: passwordVar,
      });

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: jsonString
      };

      if (passwordVar === confPasswordVar) {
        const res = await fetch('http://localhost:3000/auth/register', requestOptions);

        const out = await res.json();
        console.log('res',res);
        console.log('out',out);
        if (res.ok) {
          setRegisterSuccess(true);
        } else if (res.status === 401) {
          if (out === "Invalid Password") {
            setPasswordError(true);
          } else if (out === "Invalid Email") {
            setEmailError(true);
          } else if(out === "User Already Exists") {
            setUserExistError(true);
          }
        }
      } else {
        setConfirmPwError(true);
      }
      
    }

    
  return (
    <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Register for Eventful
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      <FormControl>
        <Typography id="modal-modal-title" variant="h6" component="h2">
        First Name: 
        </Typography>
        <TextField
            required
            id="fistNameRego"
            placeholder='jane'
            onChange={e => setFirstName(e.target.value)}
            type='text'
            aria-label="title text input"
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Last Name:
        </Typography>
        <TextField
            required
            id="lastNameRego"
            placeholder='smith'
            onChange={e => setLastName(e.target.value)}
            type='text'
            aria-label="title text input"
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
        Email:
        </Typography>
        <TextField
            required
            id="emailRego"
            placeholder='jane@email.com'
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
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
            onChange={e => setConfPassword(e.target.value)}
            type='password'
            aria-label="title text input"
        />
        {/* <RadioGroup
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
        </RadioGroup> */}
        {/* <>{card && <>
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
            /> ) </>}</> */}
        
        <button
          type="submit"
          id="SubmitRego"
          aria-label="submit login form"
          onClick={handleSubmit}
          style = {{marginTop: "10%"}}
        >
          submit
        </button>
        {
          passwordError === true
            ? (<Alert aria-label="password minimum requirements error" id='password minimum requirements error' severity="error">Password needs to be at least 8 characters in length</Alert>)
            : null
        }
        {
          emailError === true
            ? (<Alert aria-label="invalid email error" id='invalid email error' severity="error">Invalid email, please check if your email is correct</Alert>)
            : null
        }
        {
          userExistError === true
            ? (<Alert aria-label="user already exist error" id='user already exist error' severity="error">Email already exist, please login</Alert>)
            : null
        }
        {
          registerSuccess === true
            ? (<Alert aria-label="Registered Successfully" id='register success alert' severity="success">you have registered successfully, please login</Alert>)
            : null
        }
        {
          confirmPwError === true
            ? (<Alert aria-label="passwords does not match error" id='confirmation password error alert' severity="error">your password does not match with confirmed password, please check your password</Alert>)
            : null
        }
        
      </FormControl>
    </Typography>
  </Box>
  );
};
export default RegisterForm;