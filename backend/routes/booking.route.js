import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import * as bookingController from '../controllers/booking.controller.js'

const bookingRouter = Router();

// All routes for booking and ticket related actions
// Route: /events
bookingRouter.get('/:eventID/ticketTypes', bookingController.getEventTicketTypesController);
bookingRouter.get('/:eventID/tickets', verifyToken, bookingController.getEventTicketsController);
bookingRouter.get('/:eventID/availableTickets', verifyToken, bookingController.getEventAvailableTicketsController);
bookingRouter.get('/:eventID/availableTicketGroup', bookingController.getEventAvailableTicketGroupController);
bookingRouter.get('/:eventID/seats', verifyToken, bookingController.getEventSeatsController);
bookingRouter.get('/:eventID/availableSeats', verifyToken, bookingController.getEventAvailableSeatsController);
bookingRouter.get('/:eventID/purchasedSeats', verifyToken, bookingController.getEventPurchasedSeatsController);
bookingRouter.get('/:eventID/availableSeatsByTicketType/:ticketType', verifyToken, bookingController.getEventAvailableSeatsByTicketType);
bookingRouter.get('/venues/:venueName/seatSections', verifyToken, bookingController.getEventVenueSeatSectionsController);
bookingRouter.get('/:eventID/seatSectionsTicketAllocation', verifyToken, bookingController.getEventSeatSectionTicketAllocationController);
bookingRouter.post('/:eventID/purchase', verifyToken, bookingController.bookEventController)
bookingRouter.get('/:eventID/ticketsPurchased', verifyToken, bookingController.getEventTicketsUserPurchasedController)
bookingRouter.delete('/cancelBooking/:ticketID', verifyToken, bookingController.cancelEventUserBookingController)

export default bookingRouter;