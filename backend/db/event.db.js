import db from './db.js'

// READ
const getEventByIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM events WHERE eventID = $1", [eventID])
    return result.rows
    
}

// READ
const getEventsByHostIdDb = async(userID) => {
    const result = await db.query (
        "SELECT * FROM events WHERE hostID = $1", [userID])
    return result.rows
}

// READ
const getAllEventsNotSoldOutDb = async() => {
    const result = await db.query (
        "SELECT * FROM events e WHERE e.totalTicketAmount > (SELECT count(*) FROM " +
        "ticketPurchases p WHERE e.eventID = p.eventID)"
    )
    return result.rows
}

// READ
const getAllEventsDb = async() => {
    const result = await db.query(
        "SELECT * FROM events"
    )
    return result.rows
}

// CREATE
const addEventDb = async(eventName, hostID, startDateTime, endDateTime, eventDescription,
    eventLocation, eventVenue, capacity, totalTicketAmount) => {
    const result = await db.query (
        "INSERT INTO events (eventID, eventName, hostID, startDateTime, endDateTime, eventDescription, " +
        "eventLocation, eventVenue, capacity, totalTicketAmount) VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [eventName, hostID, startDateTime, endDateTime, eventDescription, eventLocation, eventVenue, capacity, totalTicketAmount]
    )
    return result.rows[0]
}

// DELETE
const removeEventByIdDb = async(ID) => {
    const result = await db.query (
        "DELETE FROM events WHERE eventID = $1", [ID]
    )
}

// UPDATE
const publishEventByIdDb = async(eventID) => {
    const result = await db.query(
        "UPDATE events SET published = TRUE WHERE eventID = $1 RETURNING *", [eventID]
    )
    return result.rows[0]
}

export {
    getEventByIdDb,
    getEventsByHostIdDb,
    getAllEventsNotSoldOutDb,
    getAllEventsDb,
    addEventDb,
    removeEventByIdDb,
    publishEventByIdDb
}