import * as emailService from '../services/email.service'

export const sendEmailBookEventController = async(req, res) => {
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

export const sendEmailCancelEventUserBookingController = async(req, res) => {
    try {
        const {statusCode, msg} = await bookingService.cancelEventUserBookingService(req, res);
        res.status(statusCode).json(msg)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const sendEmailUnpublishEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await unpublishEventsService(req, res);

        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const sendEmailCreateEventReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await createEventReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}


