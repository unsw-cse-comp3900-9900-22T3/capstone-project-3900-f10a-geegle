import db from './db.js'

// READ
const getTicketByIdDb = async(ticketId) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE ticketID = $1", [ticketId])
    return result.rows[0]
}

// READ
const getTicketByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE eventId = $1", [eventId])
    return result.rows
}

// READ
const getTicketTypesByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT DISTINCT ticketType, price FROM tickets WHERE eventId = $1", [eventId])
    return result.rows
}

// READ
const getAvailableTicketsByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT t.ticketid, t.tickettype, t.price FROM tickets t WHERE t.eventId = $1 and " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid)", [eventId])
    return result.rows
}

// READ
const getAvailableTicketTypeGroupByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT t.tickettype, t.price, count(*) FROM tickets t WHERE t.eventId = $1 and " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid) GROUP BY t.tickettype, t.price", [eventId])
    return result.rows
}

// CREATE
const addTicketDb = async(ticketType, price, eventID) => {
    const result = await db.query (
        "INSERT INTO tickets (ticketID, ticketType, price, eventID) VALUES (default, $1, $2, $3) RETURNING *",
        [ticketType, price, eventID]
    )
    return result.rows[0]
}


// CREATE
const addTicketPurchaseDb = async(ticketID, userID, time) => {
    const result = await db.query (
        "INSERT INTO ticketPurchases (userID, ticketID, ticketPurchaseTime) VALUES ($1, $2, $3) RETURNING *",
        [userID, ticketID, time]
    )
    return result.rows[0]
}

// DELETE
const removeTicketByIdDb = async(ticketId) => {
    const result = await db.query (
        "DELETE FROM tickets WHERE ticketID = $1", [ticketId]
    )
}

// UPDATE
const assignSeatToTicketDb = async(ticketID, seatID) => {
    const result = await db.query(
        "UPDATE tickets SET seatid = $1 where ticketid = $2 RETURNING *", [seatID, ticketID]
    )
}

export {
    getTicketByEventIdDb,
    getTicketByIdDb,
    getTicketTypesByEventIdDb,
    getAvailableTicketsByEventIdDb,
    getAvailableTicketTypeGroupByEventIdDb,
    addTicketDb,
    removeTicketByIdDb,
    assignSeatToTicketDb,
    addTicketPurchaseDb
}