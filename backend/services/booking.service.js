import * as ticketdb from '../db/ticket.db.js'

export const getEventTicketTypesService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const ticketTypes = await ticketdb.getTicketTypesByEventIdDb(eventID)
        
        for (let ticketInfo of ticketTypes) {
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
        }
        
        return {tickets: ticketTypes,
                statusCode: 200,
                msg: `Ticket types for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventTicketsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getTicketByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketID'] = ticketInfo['ticketid']
            delete ticketInfo['ticketid']
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
            ticketInfo['seatID'] = ticketInfo['seatid']
            delete ticketInfo['seatid']
            delete ticketInfo['eventid']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableTicketService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getAvailableTicketsByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketID'] = ticketInfo['ticketid']
            delete ticketInfo['ticketid']
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Available tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableTicketGroupService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getAvailableTicketTypeGroupByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
            ticketInfo['remaining'] = ticketInfo['count']
            delete ticketInfo['count']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Available tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}