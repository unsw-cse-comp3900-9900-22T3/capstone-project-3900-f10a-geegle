import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import * as bookingController from '../controllers/booking.controller.js'

const bookingRouter = Router();

// Make this user must be registered?
bookingRouter.get('/:eventID/ticketTypes', verifyToken, bookingController.getEventTicketTypesController);
bookingRouter.get('/:eventID/tickets', verifyToken, bookingController.getEventTicketsController);
bookingRouter.get('/:eventID/availableTickets', verifyToken, bookingController.getEventAvailableTicketsController);
bookingRouter.get('/:eventID/availableTicketGroup', verifyToken, bookingController.getEventAvailableTicketGroupController);
bookingRouter.get('/:eventID/seats', verifyToken, bookingController.getEventSeatsController);
bookingRouter.get('/:eventID/availableSeats', verifyToken, bookingController.getEventAvailableSeatsController);
//bookingRouter.get('/:eventID/seatInfo/:seatID', verifyToken, bookingController.getEventSeatInfoController);
// get seat info: seat name, ticket type for the seat, reserved or availabl --> means we have to assign every seat to a tickettype

export default bookingRouter;