import { Router } from 'express';
import { getEventController, getUpcomingEventsController, getAllEventsController, createEventsController,
         publishEventsController, unpublishEventsController, deleteEventsController, getHostEventsController } 
         from '../controllers/event.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';
import bookingRouter from './booking.route.js';

const eventRouter = Router();

eventRouter.post('/create', verifyToken, createEventsController);
eventRouter.put('/:eventID/publish', verifyToken, publishEventsController)
eventRouter.put('/:eventID/cancel', verifyToken, unpublishEventsController)
eventRouter.delete('/:eventID/delete', verifyToken, deleteEventsController)
eventRouter.get('/:eventID/info', getEventController);
eventRouter.get('/upcoming', getUpcomingEventsController);
eventRouter.get('/all', getAllEventsController);
eventRouter.get('/host', verifyToken, getHostEventsController);
eventRouter.post('/:eventID/purchase', (req, res) => {})
eventRouter.get('/:eventID/guest', (req, res) => {});

eventRouter.use(bookingRouter)

export default eventRouter;