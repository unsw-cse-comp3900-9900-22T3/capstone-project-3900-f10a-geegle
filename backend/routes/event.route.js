import { Router } from 'express';
import { getEventController, getUpcomingEventsController, getAllEventsController, createEventsController,
         publishEventsController, unpublishEventsController, editEventsController, deleteEventsController, 
         getHostEventsController, getEventsUserAttendingController, getEventGuestListController, getHostDetailsController,
         isEventSoldOutController, getSoldOutEventsController, getMatchingEventsController, getAllEventCategoriesController, getRecommendedEventsForUserController, getEventDataController } 
         from '../controllers/event.controller.js'
import { verifyToken, userLoggedIn } from '../middleware/verifyToken.js';
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
eventRouter.get('/:eventID/info', userLoggedIn, getEventController);
eventRouter.get('/upcoming', userLoggedIn, getUpcomingEventsController);
eventRouter.get('/all', userLoggedIn, getAllEventsController);
eventRouter.get('/host', verifyToken, getHostEventsController);
eventRouter.get('/recommended', verifyToken, getRecommendedEventsForUserController)
eventRouter.get('/host/details/:hostID', getHostDetailsController);
eventRouter.get('/attending', verifyToken, getEventsUserAttendingController);
eventRouter.get('/:eventID/guest', verifyToken, getEventGuestListController);
eventRouter.get('/:eventID/isSoldOut', userLoggedIn, isEventSoldOutController);
eventRouter.get('/soldOut', userLoggedIn, getSoldOutEventsController);
eventRouter.get('/find', userLoggedIn, getMatchingEventsController);
eventRouter.get('/categories', getAllEventCategoriesController);
eventRouter.get('/dashboard/:eventID', verifyToken, getEventDataController);

eventRouter.use(bookingRouter)
eventRouter.use(reviewRouter)
eventRouter.use(emailRouter)

export default eventRouter;