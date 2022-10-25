import * as bookingService from '../services/booking.service.js'

export const getEventTicketTypesController = async(req, res) => {
    try {
        const {tickets,statusCode, msg} = await bookingService.getEventTicketTypesService(req, res);

        if (!tickets) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({tickets, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventTicketsController = async(req, res) => {
    try {
        const {tickets,statusCode, msg} = await bookingService.getEventTicketsService(req, res);

        if (!tickets) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({tickets, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableTicketsController = async(req, res) => {
    try {
        const {tickets,statusCode, msg} = await bookingService.getEventAvailableTicketService(req, res);

        if (!tickets) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({tickets, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableTicketGroupController = async(req, res) => {
    try {
        const {tickets,statusCode, msg} = await bookingService.getEventAvailableTicketGroupService(req, res);

        if (!tickets) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({tickets, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventSeatsController = async(req, res) => {
    try {
        const {seats,statusCode, msg} = await bookingService.getEventSeatsService(req, res);

        if (!seats) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({seats, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getEventAvailableSeatsController = async(req, res) => {
    try {
        const {seats,statusCode, msg} = await bookingService.getEventAvailableSeatsService(req, res);

        if (!seats) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({seats, msg})
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}