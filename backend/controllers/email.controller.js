import * as emailService from '../services/email.service.js'

export const bookEventController = async(req, res) => {
    try {
        await emailService.bookEventService(req, res);
        res.status(200).json("Email sent!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const cancelEventUserBookingController = async(req, res) => {
    try {
        await emailService.cancelUserBookingService(req, res);
        res.status(200).json("Email sent!")
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const unpublishEventsController = async(req, res) => {
    try {
        await emailService.unpublishEventsService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const notifyReviewReplyController = async(req, res) => {
    try {
        await emailService.notifyReviewReplyService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const sendEventAnnouncementController = async(req, res) => {
    try {
        await emailService.sendEventAnnouncementService(req, res);
        res.status(200).json("Email sent!")
    } catch (e) {
        res.status(500).send(e.message)
    }
}
