import db from './db.js'

// READ
const getTicketPurchaseByTicketIdDb = async(ticketId) => {
    const result = await db.query (
        "SELECT * FROM ticketPurchases WHERE ticketID = $1", [ticketId])
    return result.rows[0]
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
    addTicketPurchaseDb,
    removeTicketPurchaseByTicketIdDb
}