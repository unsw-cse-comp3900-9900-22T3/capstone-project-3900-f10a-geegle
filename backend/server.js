import express from 'express';
import morgan from 'morgan';
import eventRouter from './routes/event.route.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/events', eventRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});