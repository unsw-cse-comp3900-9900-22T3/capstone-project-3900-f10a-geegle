import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'
import * as eventdb from '../db/event.db.js'
import * as ticketPurchasedb from '../db/ticketpurchase.db.js'
import * as userdb from '../db/user.db.js'
import nodemailer from 'nodemailer'

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

export const getEventPurchasedSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenuePurchasedSeatsByEventIdDb(eventID)
        
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
                msg: `Purchased seats for Event ${eventID}`}

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

export const getEventSeatSectionTicketAllocationService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seatSectionsDb = await eventdb.getEventSeatSectionTicketAllocationDb(eventID)
        
        const seatSection = {}
        for (let ss of seatSectionsDb) {
            if (ss.seatsection in seatSection) {
                seatSection[ss.seatsection].push(ss.tickettype)
            } else {
                seatSection[ss.seatsection] = [ss.tickettype]
            } 
        }

        return {seatSections: seatSection,
                statusCode: 200,
                msg: `Ticket types allocated to seat sections at Event ${eventID}`}

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
        const { tickets, seats, creditCard } = req.body;

        if (seats.length !== 0 && tickets.length !== seats.length) {
            return { booking: null, statusCode: 400, msg: "Number of tickets and seats selected not equal"}
        }

        // Check credit card correct
        if (creditCard.useStored) {
            const cc = await userdb.getUserCreditCardbyIdDb(userID)
            if (cc.length === 0) {
                return { booking: null, statusCode: 400, msg: "User has no credit card saved"}
            }
        } else if (!checkValidCreditCard(creditCard.creditCardNum, creditCard.ccv, creditCard.expiryMonth, creditCard.expiryYear)) {
            return { booking: null, statusCode: 400, msg: "Invalid credit card details"}
        }

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
            if (seatFromDB.length !== 0) {
                return { booking: null, statusCode: 400, msg: `Seat '${seats[i]}' already taken`}
            }
            
            const allowed = await venueSeatingdb.isSeatInSeatSectionAllocatedToTicketTypeDb(eventID, seats[i], tickets[i])
            
            if (allowed.length === 0) {
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
            if (ticketResult.length === 0) {
                continue
            } 

            ticketResult = ticketResult[0]
            if (seats.length !== 0) {
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

        return { booking: ticketPurchases, statusCode: 200, msg: `Tickets purchased to Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

const checkValidCreditCard = (cardNo, ccv, expiryMonth, expiryYear) => {
    const regexCardNo = new RegExp('^[0-9]{16}$')
    const regexCCV = new RegExp('^[0-9]{3}$')
    const regexMonth = new RegExp('^[0-1][0-9]$')
    const regexYear = new RegExp('^[0-9]{2}$')
    
    return (regexCardNo.test(cardNo)       && 
            regexCCV.test(ccv)             &&
            regexMonth.test(expiryMonth)   && 
            parseInt(expiryMonth) <= 12     && 
            regexYear.test(expiryYear)) 
}

export const getEventTicketsUserPurchasedService = async(req, res) => {
    try {
        const userID = req.userID
        const eventID = req.params.eventID
        const tickets = await ticketPurchasedb.getTicketPurchaseByUserIdDb(eventID, userID) 
        
        for (const ticket of tickets) {
            ticket['ticketID'] = ticket['ticketid']
            delete ticket['ticketid']
            ticket['ticketType'] = ticket['tickettype']
            delete ticket['tickettype']
            ticket['eventID'] = ticket['eventid']
            delete ticket['eventid']
            ticket['seatID'] = ticket['seatid']
            delete ticket['seatid']
            ticket['seatSection'] = ticket['seatsection']
            delete ticket['seatsection']
            ticket['seatRow'] = ticket['seatrow']
            delete ticket['seatrow']
            ticket['seatNo'] = ticket['seatno']
            delete ticket['seatno']
            ticket['userID'] = ticket['userid']
            delete ticket['userid']
            ticket['ticketPurchaseTime'] = ticket['ticketpurchasetime']
            delete ticket['ticketpurchasetime']
        }

        return { tickets: tickets, statusCode: 200, msg: `User ${userID} tickets to Event ${eventID}`}
    } catch (error) {
        throw error
    }
}

export const cancelEventUserBookingService = async(req, res) => {
    try {
        
        await venueSeatingdb.unassignSeatFromTicketDb(req.params.ticketID)
        await ticketPurchasedb.removeTicketPurchaseByTicketIdDb(req.params.ticketID)

        return {statusCode: 200, msg: `Ticket ${req.params.ticketID} has been cancelled`}

    } catch (error) {
        throw error
    }
}