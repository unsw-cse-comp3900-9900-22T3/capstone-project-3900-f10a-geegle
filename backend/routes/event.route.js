import { Router } from 'express';

const eventRouter = Router();

eventRouter.route('/')
    .get((req, res) => {});


export default eventRouter;