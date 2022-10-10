import { Router } from 'express';
import { registerUserController } from '../controllers/auth.controller.js'

const authRouter = Router();

authRouter.post('/register', registerUserController);

// authRouter.post('/login', loginUser);


export default authRouter;