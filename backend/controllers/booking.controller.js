import * as bookingService from '../services/booking.service.js'

// Controller layer to get event ticket types
export const getEventTicketTypesController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventTicketTypesService(req, res);
        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event tickets
export const getEventTicketsController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventTicketsService(req, res);
        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get available tickets
export const getEventAvailableTicketsController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventAvailableTicketService(req, res);
        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get available ticket groups
export const getEventAvailableTicketGroupController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventAvailableTicketGroupService(req, res);
        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event seats
export const getEventSeatsController = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventSeatsService(req, res);
        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get available event seats
export const getEventAvailableSeatsController = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventAvailableSeatsService(req, res);
        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get purchased event seats
export const getEventPurchasedSeatsController = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventPurchasedSeatsService(req, res);
        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get available event seats by ticket type
export const getEventAvailableSeatsByTicketType = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventAvailableSeatsByTicketTypeService(req, res);
        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event venue seat sections
export const getEventVenueSeatSectionsController = async(req, res) => {
    try {
        const {seatSections, statusCode, msg} = await bookingService.getEventVenueSeatSectionsService(req, res);
        res.status(statusCode).json({seatSections, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event seat section ticket allocation
export const getEventSeatSectionTicketAllocationController = async(req, res) => {
    try {
        const {seatSections, statusCode, msg} = await bookingService.getEventSeatSectionTicketAllocationService(req, res);
        res.status(statusCode).json({seatSections, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event seat information
export const getEventSeatInfoController = async(req, res) => {
    try {
        const {seat, statusCode, msg} = await bookingService.getEventSeatInfoService(req, res);
        res.status(statusCode).json({seat, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to book tickets to an event
export const bookEventController = async(req, res) => {
    try {
        const {booking, statusCode, msg} = await bookingService.bookEventService(req, res);

        if (!booking) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({booking, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to get event tickets that a user purchased
export const getEventTicketsUserPurchasedController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventTicketsUserPurchasedService(req, res);
        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer to cancel user's booking
export const cancelEventUserBookingController = async(req, res) => {
    try {
        const {statusCode, msg} = await bookingService.cancelEventUserBookingService(req, res);
        res.status(statusCode).json(msg)

    } catch (error) {
        res.status(500).send(error.message)
    }
}