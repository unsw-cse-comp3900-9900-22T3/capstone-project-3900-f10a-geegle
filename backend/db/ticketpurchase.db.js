import db from './db.js'

// READ
const getTicketPurchaseByTicketIdDb = async(ticketId) => {
    const result = await db.query (
        "SELECT * FROM ticketPurchases WHERE ticketID = $1", [ticketId])
    return result.rows[0]
}

// READ
const getTicketPurchaseByUserIdDb = async(eventID, userID) => {
    const result = await db.query (
        "SELECT * FROM ticketPurchases tp JOIN tickets t on tp.ticketid = t.ticketid WHERE t.eventID = $1 AND tp.userID = $2", 
        [eventID, userID])
    return result.rows
}

// READ
const getUserTicketsdDb = async(userID) => {
    const result = await db.query (
        "SELECT * FROM ticketPurchases tp JOIN tickets t on tp.ticketid = t.ticketid JOIN events e on t.eventid = e.eventid " +
        "JOIN seats s on t.ticketid = s.seatid JOIN venues v on s.venueid = v.venueid WHERE tp.userID = $1", 
        [userID])
    return result.rows
}

// CREATE
const addTicketPurchaseDb = async(userId, ticketId, ticketPurchaseTime) => {
    const result = await db.query (
        "INSERT INTO ticketPurchases (userID, ticketID, ticketPurchaseTime) VALUES ($1, $2, $3) RETURNING *",
        [userId, ticketId, ticketPurchaseTime]
    )
    return result.rows[0]
}

// DELETE
const removeTicketPurchaseByTicketIdDb = async(ticketId) => {
    const result = await db.query (
        "DELETE FROM ticketPurchases WHERE ticketID = $1", [ticketId]
    )
}

// UPDATE

export {
    getTicketPurchaseByTicketIdDb,
    getTicketPurchaseByUserIdDb,
    getUserTicketsdDb,
    addTicketPurchaseDb,
    removeTicketPurchaseByTicketIdDb
}