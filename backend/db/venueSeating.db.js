import db from './db.js'

// READ query - gets venue seats by event
const getVenueSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v ON e.eventVenue = v.venueID " +
        "JOIN seats s ON v.venueID = s.venueID WHERE e.eventID = $1", [eventID])

    return result.rows
}

// READ query - gets available seats at an event's venue
const getVenueAvailableSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v ON e.eventVenue = v.venueID " +
        "JOIN seats s ON v.venueID = s.venueID WHERE e.eventID = $1" +
        "AND NOT EXISTS (SELECT FROM ticketPurchases tp JOIN tickets t ON tp.ticketID = t.ticketID " +
        "WHERE t.seatID = s.seatID AND t.eventID = $2) " +
        "AND s.seatsection IN (SELECT seatsection from eventTicketToSeatingAllocation WHERE eventID = $3)"
        , [eventID, eventID, eventID])

    return result.rows
}

// READ query - gets purchased seats at an event's venue
const getVenuePurchasedSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM ticketPurchases tp JOIN tickets t ON tp.ticketID = t.ticketID " +
        "JOIN seats s ON t.seatID = s.seatID WHERE t.eventID = $1", [eventID])

    return result.rows
}

// READ query - gets available seats at a venue by the event id and ticket type
const getVenueAvailableSeatsByEventIdAndTicketTypeDb = async(eventID, ticketType) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v ON e.eventVenue = v.venueID " +
        "JOIN seats s ON v.venueID = s.venueID WHERE e.eventID = $1" +
        "AND NOT EXISTS (SELECT FROM ticketPurchases tp JOIN tickets t ON tp.ticketID = t.ticketID " +
        "WHERE t.seatID = s.seatID AND t.eventID = $2)" +
        "AND s.seatsection IN " +
        "(SELECT etsa.seatSection from eventTicketToSeatingAllocation etsa where etsa.eventID = $3 and etsa.tickettype = $4)"
        , [eventID, eventID, eventID, ticketType])

    return result.rows
}

// READ query - gets the venue seat information by event
const getVenueSeatInfoByEventIdDb = async(eventID, seatID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno, t.ticketType, t.price " +
        "FROM seats s JOIN tickets t ON s.seatID = t.seatID WHERE t.eventID = $1 and s.seatID = $2", [eventID, seatID])

    return result.rows
}

// READ query - gets the occupant for a specific seat
const getSeatOccupantDb = async(eventID, seatID) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE eventID = $1 and seatID = $2", [eventID, seatID])

    return result.rows
}

// READ query - gets the venue seat sections by the venue name
const getVenueSeatSectionsByVenueNameDb = async(venueName) => {
    const result = await db.query (
        "SELECT distinct s.seatSection FROM seats s JOIN venues v on s.venueID = v.venueID where v.venueName = $1", [venueName])
    
    return result.rows
}

// READ query - checks if the seat is in the section allocated the the ticket type
const isSeatInSeatSectionAllocatedToTicketTypeDb = async(eventID, seatID, ticketType) => {
    const result = await db.query (
        "SELECT * FROM seats s WHERE s.seatID = $1 AND EXISTS " +
        "(SELECT FROM eventTicketToSeatingAllocation etsa WHERE etsa.eventID = $2 AND " +
        "etsa.seatSection = s.seatSection AND etsa.ticketType = $3)", 
        [seatID, eventID, ticketType])
    
    return result.rows
}

// READ query - checks if venue seating is available
const isVenueSeatingAvailableDb = async(venueID) => {
    const result = await db.query(
        "SELECT count(*) from seats where venueID = $1", [venueID])
    return result.rows[0]
}

// READ query - gets the seat by id
const getSeatBySeatId = async(seatID) => {
    const result = await db.query (
        "SELECT seatsection, seatrow, seatno FROM seats WHERE seatID = $1", [seatID])
    return result.rows
}

// UPDATE query - uassigns seat from the ticket
const unassignSeatFromTicketDb = async(ticketID) => {
    await db.query("UPDATE tickets SET seatID = NULL WHERE ticketID = $1", [ticketID])
}

export {
    getVenueSeatsByEventIdDb,
    getVenueAvailableSeatsByEventIdDb,
    getVenuePurchasedSeatsByEventIdDb,
    getVenueAvailableSeatsByEventIdAndTicketTypeDb,
    getVenueSeatInfoByEventIdDb,
    getSeatOccupantDb,
    getVenueSeatSectionsByVenueNameDb,
    isSeatInSeatSectionAllocatedToTicketTypeDb,
    isVenueSeatingAvailableDb,
    getSeatBySeatId,
    unassignSeatFromTicketDb
}