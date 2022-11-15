import db from './db.js'

// CREATE, UPDATE
const addPageViewToMetricDb = async(eventID, pageViews, dataDay, ticketCheckouts) => {
    const result = await db.query (
        "INSERT INTO eventMetrics (eventID, pageViews, dataDay, ticketCheckouts) " +
        "VALUES ($1, $2, $3, $4) ON CONFLICT (eventID, dataDay) DO UPDATE " +
        "SET pageViews = ($5 + 1) RETURNING *", 
        [eventID, pageViews, dataDay, ticketCheckouts, pageViews]
    )
    return result.rows[0]
}

// CREATE, UPDATE
const addTicketCheckoutsToMetricDb = async(eventID, pageViews, dataDay, ticketCheckouts) => {
    const result = await db.query (
        "INSERT INTO eventMetrics (eventID, pageViews, dataDay, ticketCheckouts) " +
        "VALUES ($1, $2, $3, $4) ON CONFLICT (eventID, dataDay) DO UPDATE " +
        "SET ticketCheckouts = EXCLUDED.ticketCheckouts + 1 RETURNING *", 
        [eventID, pageViews, dataDay, ticketCheckouts]
    )
    return result.rows[0]
}

// READ
const getEventMetricsDb = async(eventID, dataDay) => {
    const result = await db.query (
        "SELECT * FROM eventMetrics WHERE eventID = $1 AND dataDay = $2", 
        [eventID, dataDay]
    )
    return result.rows
}

// CREATE
const addEventTaskDb = async(eventID, taskDescription, taskCompleted) => {
    const result = await db.query (
        "INSERT INTO eventTaskList (taskID, eventID, taskDescription, taskCompleted) " +
        "VALUES (default, $1, $2, $3) RETURNING *", [eventID, taskDescription, taskCompleted]
    )
    return result.rows[0]
}

// READ
const getEventTaskByEventIDDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM eventTaskList WHERE eventID = $1", [eventID]
    )
    return result.rows
}

// UPDATE
const updateTaskByTaskIDDb = async(taskID, taskCompleted) => {
    const result = await db.query (
        "UPDATE eventTaskList SET taskCompleted = $1 WHERE taskID = $2 RETURNING *",
        [taskCompleted, taskID]
    )
    return result.rows[0]
}

export {
    addPageViewToMetricDb,
    addTicketCheckoutsToMetricDb,
    getEventMetricsDb,
    addEventTaskDb,
    getEventTaskByEventIDDb
}