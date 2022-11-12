import db from './db.js'

// READ
const getVenueSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v ON e.eventVenue = v.venueID " +
        "JOIN seats s ON v.venueID = s.venueID WHERE e.eventID = $1", [eventID])

    return result.rows
}

// READ
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

// READ
const getVenuePurchasedSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM ticketPurchases tp JOIN tickets t ON tp.ticketID = t.ticketID " +
        "JOIN seats s ON t.seatID = s.seatID WHERE t.eventID = $1", [eventID])

    return result.rows
}

// READ
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

// READ
const getVenueSeatInfoByEventIdDb = async(eventID, seatID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno, t.ticketType, t.price " +
        "FROM seats s JOIN tickets t ON s.seatID = t.seatID WHERE t.eventID = $1 and s.seatID = $2", [eventID, seatID])

    return result.rows
}

// READ
const getSeatOccupantDb = async(eventID, seatID) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE eventID = $1 and seatID = $2", [eventID, seatID])

    return result.rows
}

// READ
const getVenueSeatSectionsByVenueNameDb = async(venueName) => {
    const result = await db.query (
        "SELECT distinct s.seatSection FROM seats s JOIN venues v on s.venueID = v.venueID where v.venueName = $1", [venueName])
    
    return result.rows
}

// READ
const isSeatInSeatSectionAllocatedToTicketTypeDb = async(eventID, seatID, ticketType) => {
    const result = await db.query (
        "SELECT * FROM seats s WHERE s.seatID = $1 AND EXISTS " +
        "(SELECT FROM eventTicketToSeatingAllocation etsa WHERE etsa.eventID = $2 AND " +
        "etsa.seatSection = s.seatSection AND etsa.ticketType = $3)", 
        [seatID, eventID, ticketType])
    
    return result.rows
}

// READ
const isVenueSeatingAvailableDb = async(venueID) => {
    const result = await db.query(
        "SELECT count(*) from seats where venueID = $1", [venueID])
    return result.rows[0]
}

// READ
const getSeatBySeatId = async(seatID) => {
    const result = await db.query (
        "SELECT seatsection, seatrow, seatno FROM seats WHERE seatID = $1", [seatID])
    return result.rows
}

// UPDATE
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