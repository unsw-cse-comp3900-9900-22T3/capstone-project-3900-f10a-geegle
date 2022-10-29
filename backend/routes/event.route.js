import { Router } from 'express';
import { getEventController, getUpcomingEventsController, getAllEventsController, createEventsController,
         publishEventsController, unpublishEventsController, deleteEventsController, getHostEventsController, 
         getEventReviewsController, createEventReviewController, editEventReviewController,
         deleteEventReviewController, addLikeToEventReviewController, removeLikeToEventReviewController } 
         from '../controllers/event.controller.js'
import { verifyToken } from '../middleware/verifyToken.js';

const eventRouter = Router();

eventRouter.post('/create', verifyToken, createEventsController);
eventRouter.put('/:eventID/publish', verifyToken, publishEventsController)
eventRouter.put('/:eventID/cancel', verifyToken, unpublishEventsController)
eventRouter.delete('/:eventID/delete', verifyToken, deleteEventsController)
eventRouter.get('/:eventID/info', getEventController);
eventRouter.get('/upcoming', getUpcomingEventsController);
eventRouter.get('/all', getAllEventsController);
eventRouter.get('/host', verifyToken, getHostEventsController);
eventRouter.post('/:eventID/purchase', (req, res) => {});
eventRouter.get('/:eventID/guest', (req, res) => {});
eventRouter.get('/:eventID/reviews', getEventReviewsController); //get all reviews for an event
eventRouter.post('/:eventID/reviews', verifyToken, createEventReviewController); //send a review for an event
eventRouter.put('/:eventID/reviews/:reviewID', verifyToken, editEventReviewController); // edit a review for an event if its yours
eventRouter.delete('/:eventID/reviews/:reviewID', verifyToken, deleteEventReviewController) // delete a review for an event if its yours 
eventRouter.post('/:eventID/reviews/:reviewID/like', verifyToken, addLikeToEventReviewController); // add like to a review parent
eventRouter.delete('/:eventID/reviews/:reviewID/unlike', verifyToken, removeLikeToEventReviewController); // remove like to parent review
eventRouter.get('/:eventID/reviews/:reviewID/reply', (req, res) => {}); // get all replies to a review
eventRouter.post('/:eventID/reviews/:reviewID/reply', (req, res) => {}); // reply to a review for an event
eventRouter.put('/:eventID/reviews/:reviewID/reply/:replyID', (req, res) => {}); // edit a reply for an event if its yours
eventRouter.delete('/:eventID/reviews/:reviewID/reply/:replyID', (req, res) => {}); // delete a review for an event if its yours
export default eventRouter;