import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import * as emailController from '../controllers/email.controller'

const emailRouter = Router();

emailRouter.put('/:eventID/emailPurchase', verifyToken, emailController.sendEmailBookEventController)
emailRouter.put('/emailCancelBooking/:ticketID', verifyToken, emailController.sendEmailCancelEventUserBookingController)
emailRouter.put('/:eventID/emailCancelEvent', verifyToken, emailController.sendEmailUnpublishEventsController)
emailRouter.put('/:eventID/emailEventAnnouncement', verifyToken, emailController.sendEmailEventAnnouncementController)
emailRouter.put('/:eventID/reviews/:reviewID/emailReply', verifyToken, emailController.sendEmailCreateEventReviewReplyController); 

export default emailRouter;