import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

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

const LoginPage = ({setLoggedIn}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false); // check if password is correct for that email
    const [inavlidEmailError, setInvalidEmailError] = React.useState(false); // check if email follows convention
    const [userExistError, setUserExistError] = React.useState(false); // check if email exist in the system
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // set all the error to their default state
      setPasswordError(false); // check if password is correct for that email
      setInvalidEmailError(false); // check if email follows convention
      setUserExistError(false); // check if email exist in the system

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', json.user.userID)
        // setLogin(true);

        //alert('Success, you are now logged in!');
        navigate('/');
      } else if (response.status === 401) {
        if (json === "Invalid Email") {
          setInvalidEmailError(true);
        } else if (json === "Email Does Not Exist") {
          setUserExistError(true);
        } else if (json === "Invalid Password") {
          setPasswordError(true);
        }
      } 
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
            id="email"
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
            id="password"
            placeholder="your password"
            onChange={e => setPassword(e.target.value)}
            type='password'
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
        {inavlidEmailError === true
          ? (<Alert severity="error">Error, email invalid, please check if email follows convention</Alert>):null}
        {userExistError === true
          ? (<Alert severity="error">Error, email does not exist, please register</Alert>):null}
        {passwordError === true
          ? (<Alert severity="error">Error, password incorrect</Alert>):null}
        
    </FormControl>
    </Typography>
  </Box>
  );
};
export default LoginPage;