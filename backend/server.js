import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import eventRouter from './routes/event.route.js';
import userRouter from './routes/user.route.js';
import { updateSim } from './utils/event.similarity.js'

// Backfills event similarity if db was initialised before similarity added
await updateSim();

// Setup cors, morgan and express for our server
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit:'10mb', extended: true }));
app.use(morgan('dev'));

// API routes
app.use('/auth', authRouter);
app.use('/events', eventRouter);
app.use('/user', userRouter);

// Creates a socket to listen at new port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
