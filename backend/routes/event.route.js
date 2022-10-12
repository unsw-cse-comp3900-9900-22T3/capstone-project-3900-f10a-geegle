import { Router } from 'express';
import { getUpcomingEventsController, getAllEventsController, createEventsController,
publishEventsController, cancelEventsController } from '../controllers/event.controller.js'

const eventRouter = Router();

eventRouter.post('/create', verifyToken, createEventsController);
eventRouter.put('/:eventID/publish', verifyToken, publishEventsController)
eventRouter.delete('/:eventID/cancel', verifyToken, cancelEventsController)
eventRouter.get('/upcoming', getUpcomingEventsController);
eventRouter.get('/all', getAllEventsController);
eventRouter.post('/:eventID/purchase', (req, res) => {})
eventRouter.get('/:eventID/guest', (req, res) => {});

export default eventRouter;