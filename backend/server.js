import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import db from './db/db.js';
import authRouter from './routes/auth.route.js';
import eventRouter from './routes/event.route.js';

db.query('select * from users', (err, res) => {
    console.log(res.rows)
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/auth', authRouter);
app.use('/events', eventRouter);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
