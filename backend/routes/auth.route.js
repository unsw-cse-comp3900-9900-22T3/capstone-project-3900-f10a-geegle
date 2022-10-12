import { Router } from 'express';
import { registerUserController, loginUserController, verifyUserTokenController } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.post('/verifyToken', verifyToken, verifyUserTokenController);


export default authRouter;