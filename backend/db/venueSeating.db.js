import db from './db.js'

// READ
const getVenueSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v on e.eventVenue = v.venueID " +
        "JOIN seats s on v.venueID = s.venueID WHERE e.eventID = $1", [eventID])

    return result.rows[0]
}

// READ
const getVenueAvailableSeatsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT s.seatid, s.seatsection, s.seatrow, s.seatno FROM events e JOIN venues v on e.eventVenue = v.venueID " +
        "JOIN seats s on v.venueID = s.venueID WHERE e.eventID = $1" +
        "AND NOT EXISTS (SELECT FROM ticketPurchases tp JOIN tickets t on tp.ticketID = t.ticketID " +
        "WHERE t.seatID = s.seatID)", [eventID])

    return result.rows[0]
}

export {
    getVenueSeatsByEventIdDb,
    getVenueAvailableSeatsByEventIdDb
}