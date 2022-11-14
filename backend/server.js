import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import db from './db/db.js';
import authRouter from './routes/auth.route.js';
import eventRouter from './routes/event.route.js';
import userRouter from './routes/user.route.js';
import {testAlgo} from './utils/event.similarity.js'
import { getRecommendedEventsForUserController } from './controllers/event.controller.js';

db.query('select * from users', (err, res) => {
    console.log(res.rows)
});
db.query('select * from reviewLikes', (err, res) => {
    console.log(res.rows)
});

// insert into db similairty for backward compat
await testAlgo();


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit:'10mb', extended: true }));
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/auth', authRouter);
app.use('/events', eventRouter);
app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
