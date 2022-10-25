import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'

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

export const getEventSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenueSeatsByEventIdDb(eventID)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `All seats for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenueAvailableSeatsByEventIdDb(eventID)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `Available seats for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventSeatInfoService = async(req, res) => {
    try {
        const { eventID, seatID } = req.params;
        const seat = await venueSeatingdb.getVenueSeatInfoByEventIdDb(eventID, seatID)

        seat['seatID'] = seat['seatid']
        delete seat['seatID']
        seat['seatSection'] = seat['seatsection']
        delete seat['seatsection']
        seat['seatRow'] = seat['seatrow']
        delete seat['seatrow']
        seat['seatNo'] = seat['seatno']
        delete seat['seatno']

        const occupied = await venueSeatingdb.getSeatOccupantDb(eventID, seat.seatID)
        console.log(occupied)
        if (occupied.length == 1) {
            seat['available'] = false
        } else {
            seat['available'] = true
        }

        return {seat: seat,
                statusCode: 200,
                msg: `Seat information for Seat ${seat.seatID} in Event ${eventID}`}

    } catch (error) {
        throw error
    }
}