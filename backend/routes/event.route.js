import { Router } from 'express';
import { getEventController, getUpcomingEventsController, getAllEventsController, createEventsController,
         publishEventsController, unpublishEventsController, editEventsController, deleteEventsController, 
         getHostEventsController, getEventsUserAttendingController, getEventGuestListController, getHostDetailsController,
         isEventSoldOutController, getSoldOutEventsController, getMatchingEventsController, getAllEventCategoriesController, getRecommendedEventsForUserController } 
         from '../controllers/event.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';
import bookingRouter from './booking.route.js';
import reviewRouter from './review.route.js';
import emailRouter from './email.route.js';

const eventRouter = Router();

eventRouter.post('/create', verifyToken, createEventsController);
eventRouter.put('/:eventID/publish', verifyToken, publishEventsController)
eventRouter.put('/:eventID/cancel', verifyToken, unpublishEventsController)
// TODO
eventRouter.put('/:eventID/edit', verifyToken, editEventsController)
eventRouter.delete('/:eventID/delete', verifyToken, deleteEventsController)
eventRouter.get('/:eventID/info', getEventController);
eventRouter.get('/upcoming', getUpcomingEventsController);
eventRouter.get('/all', getAllEventsController);
eventRouter.get('/host', verifyToken, getHostEventsController);
eventRouter.get('/recommended', verifyToken, getRecommendedEventsForUserController)
eventRouter.get('/host/details/:hostID', getHostDetailsController);
eventRouter.get('/attending', verifyToken, getEventsUserAttendingController);
eventRouter.get('/:eventID/guest', verifyToken, getEventGuestListController);
eventRouter.get('/:eventID/isSoldOut', isEventSoldOutController);
eventRouter.get('/soldOut', getSoldOutEventsController);
eventRouter.get('/find', getMatchingEventsController);
eventRouter.get('/categories', getAllEventCategoriesController);

eventRouter.use(bookingRouter)
eventRouter.use(reviewRouter)
eventRouter.use(emailRouter)

export default eventRouter;