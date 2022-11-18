import * as emailService from '../services/email.service.js'

// Controller layer for sending an email after booking an event
export const bookEventController = async(req, res) => {
    try {
        await emailService.bookEventService(req, res);
        res.status(200).json("Email sent!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer for sending an email after an event is cancelled
export const cancelEventUserBookingController = async(req, res) => {
    try {
        await emailService.cancelUserBookingService(req, res);
        res.status(200).json("Email sent!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Controller layer for sending an email after an event is unpublished
export const unpublishEventsController = async(req, res) => {
    try {
        await emailService.unpublishEventsService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for sending an email after a host replies to your review
export const notifyReviewReplyController = async(req, res) => {
    try {
        await emailService.notifyReviewReplyService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for sending an email after the host makes an event announcement
export const sendEventAnnouncementController = async(req, res) => {
    try {
        await emailService.sendEventAnnouncementService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}
