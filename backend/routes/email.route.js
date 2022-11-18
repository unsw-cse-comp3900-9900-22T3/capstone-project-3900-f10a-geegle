import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import * as emailController from '../controllers/email.controller.js'

const emailRouter = Router();

// All routes for email related actions
// Route: /events
emailRouter.post('/:eventID/emailPurchase', verifyToken, emailController.bookEventController)
emailRouter.post('/emailCancelBooking/:ticketID', verifyToken, emailController.cancelEventUserBookingController)
emailRouter.post('/:eventID/emailUnpublish', verifyToken, emailController.unpublishEventsController)
emailRouter.post('/:eventID/emailEventAnnouncement', verifyToken, emailController.sendEventAnnouncementController)
emailRouter.post('/:eventID/reviews/:reviewID/emailReply', verifyToken, emailController.notifyReviewReplyController); 

export default emailRouter;