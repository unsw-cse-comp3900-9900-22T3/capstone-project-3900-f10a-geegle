import * as bookingService from '../services/booking.service.js'

export const getEventTicketTypesController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventTicketTypesService(req, res);

        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventTicketsController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventTicketsService(req, res);

        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableTicketsController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventAvailableTicketService(req, res);

        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableTicketGroupController = async(req, res) => {
    try {
        const {tickets, statusCode, msg} = await bookingService.getEventAvailableTicketGroupService(req, res);

        res.status(statusCode).json({tickets, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventSeatsController = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventSeatsService(req, res);

        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableSeatsController = async(req, res) => {
    try {
        const {seats, statusCode, msg} = await bookingService.getEventAvailableSeatsService(req, res);

        res.status(statusCode).json({seats, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventVenueSeatSectionsController = async(req, res) => {
    try {
        const {seatSections, statusCode, msg} = await bookingService.getEventVenueSeatSectionsService(req, res);
        res.status(statusCode).json({seatSections, msg})

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventSeatInfoController = async(req, res) => {
    try {
        const {seat, statusCode, msg} = await bookingService.getEventSeatInfoService(req, res);

        if (!seat) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({seat, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const bookEventController = async(req, res) => {
    try {
        const {booking,statusCode, msg} = await bookingService.bookEventService(req, res);

        if (!booking) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({booking, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}