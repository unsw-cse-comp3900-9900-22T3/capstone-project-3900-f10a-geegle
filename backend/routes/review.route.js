import { Router } from 'express';
import { verifyToken, userLoggedIn } from '../middleware/verifyToken.js';
import { getEventReviewsController, createEventReviewController, editEventReviewController,
    deleteEventReviewController, addLikeToEventReviewController, removeLikeToEventReviewController, 
    getEventReviewReplyController, createEventReviewReplyController, editEventReviewReplyController,
    deleteEventReviewReplyController, checkUserLeftReviewController, getEventReviewsUserController } from '../controllers/event.controller.js';

const reviewRouter = Router();

reviewRouter.get('/:eventID/reviews', userLoggedIn, getEventReviewsController); //get all reviews for an event
reviewRouter.get('/:eventID/reviews/user', verifyToken, getEventReviewsUserController) // if logged in
reviewRouter.post('/:eventID/reviews', verifyToken, createEventReviewController); //send a review for an event
reviewRouter.get('/:eventID/reviews/leftReview', verifyToken, checkUserLeftReviewController) // check user has left a review
reviewRouter.put('/:eventID/reviews/:reviewID', verifyToken, editEventReviewController); // edit a review for an event if its yours
reviewRouter.delete('/:eventID/reviews/:reviewID', verifyToken, deleteEventReviewController) // delete a review for an event if its yours 
reviewRouter.post('/:eventID/reviews/:reviewID/like', verifyToken, addLikeToEventReviewController); // add like to a review parent
reviewRouter.delete('/:eventID/reviews/:reviewID/unlike', verifyToken, removeLikeToEventReviewController); // remove like to parent review
reviewRouter.get('/:eventID/reviews/:reviewID/reply', getEventReviewReplyController); // get all replies to a review
reviewRouter.post('/:eventID/reviews/:reviewID/reply', verifyToken, createEventReviewReplyController); // reply to a review for an event
reviewRouter.put('/:eventID/reviews/:reviewID/reply/:replyID', verifyToken, editEventReviewReplyController); // edit a reply for an event if its yours
reviewRouter.delete('/:eventID/reviews/:reviewID/reply/:replyID', verifyToken, deleteEventReviewReplyController); // delete a review for an event if its yours

export default reviewRouter;