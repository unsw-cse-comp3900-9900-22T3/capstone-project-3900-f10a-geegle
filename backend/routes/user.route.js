import { Router } from 'express';
import { getUserProfileController, updateUserProfileController } from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';

const userRouter = Router();

userRouter.get('/profile/:userID', verifyToken, getUserProfileController);
userRouter.post('/profile/:userID', verifyToken, updateUserProfileController);

export default userRouter;