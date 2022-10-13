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
    return result
}

// CREATE
const addTicketDb = async(ticketType, price, eventID) => {
    const result = await db.query (
        "INSERT INTO tickets (ticketID, ticketType, price, eventID) VALUES (default, $1, $2, $3) RETURNING *",
        [ticketType, price, eventID]
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

export {
    getTicketByEventIdDb,
    getTicketByIdDb,
    addTicketDb,
    removeTicketByIdDb
}