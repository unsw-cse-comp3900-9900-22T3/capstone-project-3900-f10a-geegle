/* eslint-disable */ 
import * as React from 'react';
import RegisterForm from '../components/registerForm';

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

const RegisterPage = () => {
  
  return (
   <>
   <RegisterForm></RegisterForm>
   </>
  );
};
export default RegisterPage;