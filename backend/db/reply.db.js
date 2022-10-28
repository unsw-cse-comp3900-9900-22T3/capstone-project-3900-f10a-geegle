import db from './db.js'


// NOT COMPLETED
// READ
const getReplyByReviewIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM reviews WHERE eventID = $1", [eventID]
    )
    return result.rows
}

// READ
const getReplyByReplyIdDb = async(reviewID) => {
    const result = await db.query (
        "SELECT * FROM reviews WHERE reviewID = $1", [reviewID]
    )
    return result.rows
}

// CREATE
const addReplyDb = async(eventID, userID, rating, review, postedOn) => {
    const result = await db.query (
        "INSERT INTO reviews (reviewID, eventID, userID, rating, review, postedOn) VALUES " +
        "(default, $1, $2, $3, $4, $5) RETURNING *", [eventID, userID, rating, review, postedOn]
    )
    return result.rows[0]
}

// UPDATE
const editReplyByIdDb = async()


export {
    getReplyByReviewIdDb,
    getReplyByReplyIdDb,
    addReplyDb
}