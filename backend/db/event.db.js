import db from './db.js'

// READ query - gets an event by id
const getEventByIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM events WHERE eventID = $1", [eventID])
    return result.rows
}

// READ query - gets an event by id
const getEventByIdDisplayDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM events e JOIN users u ON (e.hostID = u.userID) " +
        "JOIN venues v on (e.eventVenue = v.venueID) WHERE eventID = $1", [eventID])
    return result.rows
}

// READ query - gets an event by the host
const getEventsByHostIdDb = async(userID) => {
    const result = await db.query (
        "SELECT * FROM events e JOIN venues v ON (e.eventVenue = v.venueID) WHERE e.hostID = $1", [userID])
    return result.rows
}

// READ query - gets the events a user is attending
const getEventsUserAttendingDb = async(userID) => {
    const result = await db.query (
        "SELECT DISTINCT e.eventID from ticketPurchases tp " +
        "JOIN tickets t ON tp.ticketid = t.ticketid " +
        "JOIN events e ON t.eventID = e.eventID WHERE tp.userID = $1", [userID])
    return result.rows
}

// READ query - gets the events a user is attending by a specific host
const getEventsUserAttendingFromHostDb = async(userID, hostID) => {
    const result = await db.query (
        "SELECT DISTINCT e.eventID from ticketPurchases tp " +
        "JOIN tickets t ON tp.ticketid = t.ticketid " +
        "JOIN events e ON t.eventID = e.eventID WHERE tp.userID = $1 AND e.hostID = $2", [userID, hostID])
    return result.rows
}

// READ query - gets all events that arent sold out
const getAllEventsNotSoldOutDb = async() => {
    const result = await db.query (
        "SELECT * FROM events e JOIN venues v ON (e.eventVenue = v.venueID) " +
        "JOIN users u ON (e.hostID = u.userID) " +
        "WHERE e.totalTicketAmount > (SELECT count(*) FROM tickets t, ticketPurchases p " +
        "WHERE e.eventID = t.eventID AND t.ticketID = p.ticketID)"
    )
    return result.rows
}

// READ query - gets all events
const getAllEventsDb = async() => {
    const result = await db.query(
        "SELECT * FROM events e JOIN venues v ON (e.eventVenue = v.venueID) JOIN users u ON (e.hostID = u.userID)"
    )
    return result.rows
}

// READ query - gets a venue by name
const getEventVenueByNameDb = async(venueName) => {
    const result = await db.query(
        "SELECT * from venues where venueName = $1", [venueName])
    return result.rows
}

// READ query - gets a venue by id
const getEventVenueByIdDb = async(venueID) => {
    const result = await db.query(
        "SELECT * from venues where venueName = $1", [venueID])
    return result.rows
}

//READ query - gets the host of an event
const getHostofEventDb = async(eventID) => {
    const result = await db.query(
        "SELECT hostid from events where eventid = $1", [eventID]
    )
    return result.rows
}

// READ query - gets the guest list by id
const getEventGuestListByIdDb = async(eventID) => {
    const result = await db.query(
        "SELECT distinct u.userid, u.firstname, u.lastname, u.email from ticketPurchases tp " +
        "JOIN tickets t ON tp.ticketid = t.ticketid " +
        "JOIN users u ON tp.userid = u.userid WHERE t.eventid = $1", [eventID])
    return result.rows
}

//READ query - gets the ticket type and seat allocation of an event
const getEventSeatSectionTicketAllocationDb = async(eventID) => {
    const result = await db.query(
        "SELECT ticketType, seatSection from eventTicketToSeatingAllocation where eventid = $1", [eventID]
    )
    return result.rows
}

//READ query - get whether an event is seated
const isSeatedEventDb = async(eventID) => {
    const result = await db.query(
        "SELECT * from eventTicketToSeatingAllocation where eventid = $1", [eventID]
    )
    return result.rows
}

//READ query - determines whether an event is sold out
const isEventSoldOutDb = async(eventID) => {
    const result = await db.query(
        "SELECT * FROM events e WHERE e.eventID = $1 AND e.totalTicketAmount =  " +
        "(SELECT count(*) FROM ticketpurchases tp JOIN tickets t ON tp.ticketid = t.ticketid WHERE t.eventID = e.eventID)", [eventID]
    )
    return result.rows
}

//READ query - gets all sold out events
const getSoldOutEventsDb = async() => {
    const result = await db.query(
        "SELECT * FROM events e JOIN users u ON e.hostID = u.userID JOIN venues v ON e.eventvenue = v.venueID WHERE e.totalTicketAmount =  " +
        "(SELECT count(*) FROM ticketpurchases tp JOIN tickets t ON tp.ticketid = t.ticketid WHERE t.eventID = e.eventID)"
    )
    return result.rows
}

//READ query - get events that match specific criteria
const getMatchingEventsDb = async(searchWords) => {
    const search = '%' + searchWords + '%'
    const result = await db.query(
        "SELECT * FROM events e JOIN users u ON e.hostID = u.userID JOIN venues v ON e.eventvenue = v.venueID " + 
        "WHERE e.eventName ILIKE $1 OR e.eventDescription ILIKE $2 OR e.eventType ILIKE $3", 
        [search, search, search]
    )
    
    return result.rows
}

//READ query - gets events limited by price
const getEventsByTicketPriceLimitDb = async(priceLimit) => {
    const result = await db.query(
        "SELECT distinct e.eventid FROM events e join tickets t ON e.eventid = t.eventid WHERE price <= $1",
        [priceLimit]
    )

    return result.rows
}

//READ query - gets all event categories
const getAllEventCategoriesDb = async() => {
    const result = await db.query(
        "SELECT distinct eventType from events"
    )

    return result.rows
}

// CREATE query - adds an event
const addEventDb = async(eventName, hostID, startDateTime, endDateTime, eventDescription, eventType,
                         eventVenue, capacity, totalTicketAmount, image1, image2, image3) => {
    const result = await db.query (
        "INSERT INTO events (eventID, eventName, hostID, startDateTime, endDateTime, eventDescription, " +
        "eventType, eventVenue, capacity, totalTicketAmount, image1, image2, image3) " +
        "VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        [eventName, hostID, startDateTime, endDateTime, eventDescription, eventType, eventVenue, capacity, 
         totalTicketAmount, image1, image2, image3]
    )
    return result.rows[0]
}

// CREATE query - adds an event venue
const addEventVenueDb = async(venueName, venueLocation, venueCapacity) => {
    const result = await db.query(
        "INSERT INTO venues (venueID, venueName, venueLocation, maxCapacity) VALUES (default, $1, $2, $3) RETURNING *",
        [venueName, venueLocation, venueCapacity]
    )
    return result.rows[0]
}

// CREATE query - adds event ticket type and seat section
const addEventTicketTypeSeatingAllocation = async(eventID, ticketType, seatSection) => {
    const result = await db.query(
        "INSERT INTO eventTicketToSeatingAllocation (eventID, ticketType, seatSection) VALUES ($1, $2, $3) RETURNING *",
        [eventID, ticketType, seatSection]
    )
    return result.rows[0]
}

// DELETE query - removes an event
const removeEventByIdDb = async(ID) => {
    const result = await db.query (
        "DELETE FROM events WHERE eventID = $1", [ID]
    )
}

// UPDATE query - publishes an event
const publishEventByIdDb = async(eventID) => {
    const result = await db.query(
        "UPDATE events SET published = TRUE WHERE eventID = $1 RETURNING *", [eventID]
    )
    return result.rows[0]
}

// UPDATE query - unpublished an event
const unpublishEventByIdDb = async(eventID) => {
    const result = await db.query(
        "UPDATE events SET published = FALSE WHERE eventID = $1 RETURNING *", [eventID]
    )
    return result.rows[0]
}

export {
    getEventByIdDb,
    getEventByIdDisplayDb,
    getEventsByHostIdDb,
    getEventsUserAttendingDb,
    getEventsUserAttendingFromHostDb,
    getAllEventsNotSoldOutDb,
    getAllEventsDb,
    getEventVenueByNameDb,
    getEventVenueByIdDb,
    getEventGuestListByIdDb,
    getHostofEventDb,
    getEventSeatSectionTicketAllocationDb,
    isSeatedEventDb,
    isEventSoldOutDb,
    getSoldOutEventsDb,
    getMatchingEventsDb,
    getEventsByTicketPriceLimitDb,
    getAllEventCategoriesDb,
    addEventDb,
    addEventVenueDb,
    addEventTicketTypeSeatingAllocation,
    removeEventByIdDb,
    publishEventByIdDb,
    unpublishEventByIdDb
}