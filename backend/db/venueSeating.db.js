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
        "WHERE t.seatID = s.seatID AND t.eventID = $2)", [eventID, eventID])

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

export {
    getVenueSeatsByEventIdDb,
    getVenueAvailableSeatsByEventIdDb,
    getVenueSeatInfoByEventIdDb,
    getSeatOccupantDb,
    getVenueSeatSectionsByVenueNameDb
}