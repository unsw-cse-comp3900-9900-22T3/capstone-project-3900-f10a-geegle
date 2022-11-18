import db from './db.js'

// READ query - gets a ticket by id
const getTicketByIdDb = async(ticketId) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE ticketID = $1", [ticketId])
    return result.rows[0]
}

// READ query - gets a ticket by event id
const getTicketByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE eventId = $1", [eventId])
    return result.rows
}

// READ query - gets ticket types by event
const getTicketTypesByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT DISTINCT ticketType, price FROM tickets WHERE eventId = $1", [eventId])
    return result.rows
}

// READ query - gets available tickets by event
const getAvailableTicketsByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT t.ticketid, t.tickettype, t.price FROM tickets t WHERE t.eventId = $1 AND " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid)", [eventId])
    return result.rows
}

// READ query - gets available tickets grouped by event
const getAvailableTicketTypeGroupByEventIdDb = async(eventId) => {
    const result = await db.query (
        "SELECT t.tickettype, t.price, count(*) FROM tickets t WHERE t.eventId = $1 AND " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid) GROUP BY t.tickettype, t.price", [eventId])
    return result.rows
}

// READ query - gets available tickets grouped by ticket type
const getAvailableTicketsByTicketTypeDb = async(eventId, ticketType) => {
    const result = await db.query (
        "SELECT * FROM tickets t WHERE t.eventId = $1 and t.tickettype = $2 AND " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid) " +
        "ORDER BY t.ticketID", [eventId, ticketType])
    return result.rows
}

// READ query - counts amount of tickets in an event with a specific ticket type
const getAvailableTicketsCountByTicketTypeDb = async(eventId, ticketType) => {
    const result = await db.query (
        "SELECT count(*) FROM tickets t WHERE t.eventId = $1 and t.tickettype = $2 AND " +
        "NOT EXISTS (SELECT from ticketpurchases where t.ticketid = ticketid)", [eventId, ticketType])
    return result.rows[0]
}

// READ query - gets ticket price by ticket type
const getTicketPriceByTicketType = async(ticketType, eventId)  => {
    const result = await db.query (
        "SELECT * FROM tickets WHERE eventId = $1 and tickettype = $2", [eventId, ticketType])
    return result.rows[0]
}

// CREATE query - adds a ticket
const addTicketDb = async(ticketType, price, eventID) => {
    const result = await db.query (
        "INSERT INTO tickets (ticketID, ticketType, price, eventID) VALUES (default, $1, $2, $3) RETURNING *",
        [ticketType, price, eventID]
    )
    return result.rows[0]
}

// CREATE query - purchases a ticket for the user
const addTicketPurchaseDb = async(ticketID, userID, time) => {
    const result = await db.query (
        "INSERT INTO ticketPurchases (userID, ticketID, ticketPurchaseTime) VALUES ($1, $2, $3) RETURNING *",
        [userID, ticketID, time]
    )
    return result.rows[0]
}

// DELETE query - removes a ticket
const removeTicketByIdDb = async(ticketId) => {
    const result = await db.query (
        "DELETE FROM tickets WHERE ticketID = $1", [ticketId]
    )
}

// UPDATE query - assigns a seat to a ticket
const assignSeatToTicketDb = async(ticketID, seatID) => {
    const result = await db.query(
        "UPDATE tickets SET seatid = $1 where ticketid = $2 RETURNING *", [seatID, ticketID]
    )
    return result.rows[0]
}

// UPDATE query - unasssigns a seat from an event
const unassignEventSeatsDb = async(eventID) => {
    const result = await db.query(
        "UPDATE tickets SET seatid = null where eventID = $1", [eventID]
    )
}

export {
    getTicketByEventIdDb,
    getTicketByIdDb,
    getTicketTypesByEventIdDb,
    getAvailableTicketsByEventIdDb,
    getAvailableTicketTypeGroupByEventIdDb,
    getAvailableTicketsByTicketTypeDb,
    getAvailableTicketsCountByTicketTypeDb,
    getTicketPriceByTicketType, 
    addTicketDb,
    removeTicketByIdDb,
    assignSeatToTicketDb,
    addTicketPurchaseDb,
    unassignEventSeatsDb
}