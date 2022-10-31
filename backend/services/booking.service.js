import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'
import * as eventdb from '../db/event.db.js'

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

export const getEventAvailableSeatsByTicketTypeService = async(req, res) => {
    try {
        const { eventID, ticketType } = req.params;
        const seats = await venueSeatingdb.getVenueAvailableSeatsByEventIdAndTicketTypeDb(eventID, ticketType)
        
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
                msg: `Available seats for Event ${eventID} and ticket type ${ticketType}`}

    } catch (error) {
        throw error
    }
}

export const getEventVenueSeatSectionsService = async(req, res) => {
    try {
        const venueName = req.params.venueName;
        const seats = await venueSeatingdb.getVenueSeatSectionsByVenueNameDb(venueName)
        
        return {seatSections: seats.map(seat => seat.seatsection),
                statusCode: 200,
                msg: `Seat sections at venue ${venueName}`}

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
        seat['ticketType'] = seat['tickettype']
        delete seat['tickettype']

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

export const bookEventService = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const { tickets, seats } = req.body;

        if (seats.length != 0 && tickets.length != seats.length) {
            return { booking: null, statusCode: 400, msg: "Number of tickets and seats selected not equal"}
        }
        // Check credit card correct

        // Check no. of tickets booked of each type are available
        let count = {}
        for (const ticketType of tickets) {
            count[ticketType] = count[ticketType] ? count[ticketType] + 1 : 1
        }
        
        for (const ticketType in count) {
            const available = await ticketdb.getAvailableTicketsCountByTicketTypeDb(eventID, ticketType)
            if (count[ticketType] > available.count) {
                return { booking: null, statusCode: 400, msg: `Insufficient tickets available for ticketType '${ticketType}'`}
            }
        }
        
        // Check seat not taken + ticketType can sit in that seat section
        for (let i = 0; i < seats.length; i++) {
            let seatFromDB = await venueSeatingdb.getSeatOccupantDb(eventID, seats[i])
            if (seatFromDB.length != 0) {
                return { booking: null, statusCode: 400, msg: `Seat '${seats[i]}' already taken`}
            }
            
            const allowed = await venueSeatingdb.isSeatInSeatSectionAllocatedToTicketTypeDb(eventID, seats[i], tickets[i])
            
            if (allowed.length == 0) {
                return { booking: null, statusCode: 400, msg: `Seat '${seats[i]}' cannot be chosen for ticket type: '${tickets[i]}'`}
            }
        }
        
        // DB: get all available tickets at event
        // https://stackoverflow.com/questions/3396088/how-do-i-remove-an-object-from-an-array-with-javascript
        // - Use array.findIndex to find ticket matching the ticket type
        // - Delete from available tickets

        // Alternative: each iteration get from DB list of available tickets
        /*
            For each booking:
                
                - Get a ticketID based on ticketType
                - Add seatID to the ticket
                - Add to ticketPurchases table
                
        */
        const ticketPurchases = []
        for (let i = 0; i < tickets.length; i++) {
            let ticketResult = await ticketdb.getAvailableTicketsByTicketTypeDb(eventID, tickets[i])
            if (ticketResult.length == 0) {
                continue
            } 

            ticketResult = ticketResult[0]
            if (seats.length != 0) {
                // implement this
                ticketResult = await ticketdb.assignSeatToTicketDb(ticketResult.ticketid, seats[i])
            }

            const ticketPurchase = await ticketdb.addTicketPurchaseDb(ticketResult.ticketid, userID, new Date())
            
            ticketPurchases.push({  ticketID: ticketResult.ticketid,
                                    ticketType: ticketResult.tickettype,
                                    price: ticketResult.price,
                                    eventID: ticketResult.eventid,
                                    seatID: ticketResult.seatid,
                                    userID: ticketPurchase.userid,
                                    ticketPurchaseTime: ticketPurchase.ticketpurchasetime })
        }


        // Send email confirmation

        return { booking: ticketPurchases, statusCode: 200, msg: `Tickets purchased to Event ${eventID}`}

    } catch (error) {
        throw error
    }
}