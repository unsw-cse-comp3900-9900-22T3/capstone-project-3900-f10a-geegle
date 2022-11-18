import db from './db.js'

// CREATE, UPDATE query - adds/creates a pageview to eventmetrices table
const addPageViewToMetricDb = async(eventID, pageViews, dataDay, ticketCheckouts) => {
    const result = await db.query (
        "INSERT INTO eventMetrics (eventID, pageViews, dataDay, ticketCheckouts) " +
        "VALUES ($1, $2, $3, $4) "+ 
        "ON CONFLICT (eventID, dataDay) DO UPDATE " +
        "SET pageViews = ($2 + 1) RETURNING *", 
        [eventID, pageViews, dataDay, ticketCheckouts]
    )
    return result.rows[0]
}

// UPDATE query - adds a ticket checkout to eventmetrics table
const addTicketCheckoutsToMetricDb = async(eventID, ticketCheckouts) => {
    const result = await db.query (
        "UPDATE eventMetrics SET ticketCheckouts = ($1 + 1) WHERE eventid = $2 RETURNING *", 
        [ticketCheckouts, eventID]
    )
    return result.rows[0]
}

// READ query - gets all event metrics for an event
const getEventMetricsDb = async(eventID, dataDay) => {
    const result = await db.query (
        "SELECT * FROM eventMetrics WHERE eventID = $1 AND dataDay = $2", 
        [eventID, dataDay]
    )
    return result.rows
}

// READ query - gets all event goals for an event
const getEventGoalMetricsDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM eventGoalMetrics WHERE eventID = $1", 
        [eventID]
    )
    return result.rows
}

// UPDATE query - updates all event goals for an event
const updateEventGoalMetricsDb = async(eventID, publishedGoal=false, publishedGoalTime=null, tenSalesGoal=false, tenSalesGoalTime=null, 
                                        halfSalesGoal=false, halfSalesGoalTime=null,
                                        threeQuarterSalesGoal=false, threeQuarterSalesGoalTime=null,
                                        soldOutSalesGoal=false, soldOutSalesGoalTime=null,
                                        fiveMaxReviewsGoal=false, fiveMaxReviewsGoalTime=null,
                                        tenMaxReviewsGoal=false, tenMaxReviewsGoalTime=null) => {
    const result = await db.query (

        "UPDATE eventGoalMetrics " +
        "SET publishedGoal=$2, publishedGoalTime=$3, tenSalesGoal=$4, tenSalesGoalTime=$5, halfSalesGoal=$6, halfSalesGoalTime=$7, " +
        "threeQuarterSalesGoal=$8, threeQuarterSalesGoalTime=$9, soldOutSalesGoal=$10, soldOutSalesGoalTime=$11, " +
        "fiveMaxReviewsGoal=$12, fiveMaxReviewsGoalTime=$13,tenMaxReviewsGoal=$14, tenMaxReviewsGoalTime=$15 " +
        "WHERE eventid = $1 RETURNING *", 
        [eventID, publishedGoal, publishedGoalTime, tenSalesGoal, tenSalesGoalTime, halfSalesGoal, halfSalesGoalTime,
        threeQuarterSalesGoal, threeQuarterSalesGoalTime, soldOutSalesGoal, soldOutSalesGoalTime,
        fiveMaxReviewsGoal, fiveMaxReviewsGoalTime,tenMaxReviewsGoal, tenMaxReviewsGoalTime]
    )
    return result.rows[0]
}

// CREATE query - creates goal metrics for an event
const addEventGoalMetricsDb = async(eventID) => {
    const result = await db.query (
        "INSERT INTO eventGoalMetrics (eventID, publishedGoal, publishedGoalTime, tenSalesGoal, tenSalesGoalTime, halfSalesGoal, halfSalesGoalTime, " +
        "threeQuarterSalesGoal, threeQuarterSalesGoalTime, soldOutSalesGoal, soldOutSalesGoalTime,fiveMaxReviewsGoal, fiveMaxReviewsGoalTime, " +
        "tenMaxReviewsGoal, tenMaxReviewsGoalTime) " +
        "VALUES ($1, default, null, default, null, default, null, default, null, default, null, default, null, default, null) " +
        "RETURNING *", [eventID]
    )
    return result.rows[0]
}

// CREATE query - adds an event task to the task list
const addEventTaskDb = async(eventID, taskDescription, taskCompleted) => {
    const result = await db.query (
        "INSERT INTO eventTaskList (taskID, eventID, taskDescription, taskCompleted) " +
        "VALUES (default, $1, $2, $3) RETURNING *", [eventID, taskDescription, taskCompleted]
    )
    return result.rows[0]
}

// READ query - gets all event tasks from a task list
const getEventTaskByEventIDDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM eventTaskList WHERE eventID = $1", [eventID]
    )
    return result.rows
}

// READ query - gets a task from the task list
const getEventTaskByTaskIDDb = async(taskID) => {
    const result = await db.query (
        "SELECT * FROM eventTaskList WHERE taskID = $1", [taskID]
    )
    return result.rows
}

// UPDATE query - updates a task from the task list
const updateTaskByTaskIDDb = async(taskID, taskCompleted) => {
    const result = await db.query (
        "UPDATE eventTaskList SET taskCompleted = $1 WHERE taskID = $2 RETURNING *",
        [taskCompleted, taskID]
    )
    return result.rows[0]
}

// DELETE query - deletes a task from the task list
const deleteTaskByTaskIDDb = async(taskID) => {
    await db.query (
        "DELETE FROM eventTaskList where taskID = $1",
        [taskID]
    )
}

export {
    addPageViewToMetricDb,
    addTicketCheckoutsToMetricDb,
    getEventMetricsDb,
    getEventGoalMetricsDb,
    updateEventGoalMetricsDb,
    addEventGoalMetricsDb,
    addEventTaskDb,
    getEventTaskByEventIDDb,
    getEventTaskByTaskIDDb,
    updateTaskByTaskIDDb,
    deleteTaskByTaskIDDb
}