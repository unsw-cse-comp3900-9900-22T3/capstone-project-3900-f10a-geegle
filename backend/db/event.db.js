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
        "tickets t, ticketPurchases p WHERE e.eventID = t.eventID AND t.ticketID = p.ticketID)"
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
const addEventDb = async(eventName, hostID, startDateTime, endDateTime, eventDescription, eventType,
    eventLocation, eventVenue, capacity, totalTicketAmount, image1, image2, image3) => {
    const result = await db.query (
        "INSERT INTO events (eventID, eventName, hostID, startDateTime, endDateTime, eventDescription, " +
        "eventType, eventLocation, eventVenue, capacity, totalTicketAmount, image1, image2, image3) " +
        "VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        [eventName, hostID, startDateTime, endDateTime, eventDescription, eventType, eventLocation, eventVenue, capacity, 
         totalTicketAmount, image1, image2, image3]
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