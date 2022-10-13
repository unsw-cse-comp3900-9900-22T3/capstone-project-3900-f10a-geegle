import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
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

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
  
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
            onChange={e => setEmail(e)}
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
            onChange={e => setPassword(e)}
            type='password'
            aria-label="title text input"
        />
        <button
          type="submit"
          id="loginSubmit"
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
export default LoginPage;