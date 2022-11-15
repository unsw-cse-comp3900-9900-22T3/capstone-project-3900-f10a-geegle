import db from './db.js'

// READ
const getEventReviewsByEventIdDb = async(eventID) => {
    const result = await db.query (
        "SELECT * FROM reviews WHERE eventID = $1", [eventID]
    )
    return result.rows
}

// READ
const getEventReviewsByEventIdAndUserIdDb = async(eventID, userID) => {
    const result = await db.query (
        "SELECT * FROM reviews WHERE eventID = $1 AND userID = $2",
        [eventID, userID]
    )
    return result.rows
}

// READ
const getReviewByReviewIdDb = async(reviewID) => {
    const result = await db.query (
        "SELECT * FROM reviews WHERE reviewID = $1", [reviewID]
    )
    return result.rows
}

// CREATE
const addReviewDb = async(eventID, userID, rating, review, postedOn) => {
    const result = await db.query (
        "INSERT INTO reviews (reviewID, eventID, userID, rating, review, postedOn) VALUES " +
        "(default, $1, $2, $3, $4, $5) RETURNING *", [eventID, userID, rating, review, postedOn]
    )
    return result.rows[0]
}

// UPDATE
const editReviewByIdDb = async(reviewID, review, rating, timestamp) => {
    const result = await db.query (
        "UPDATE reviews SET review = $1, rating = $2, postedOn = $3, edited = $4 WHERE reviewID = $5 RETURNING *",
        [review, rating, timestamp, true, reviewID]
    )
    return result.rows[0]
}

// DELETE
const deleteReviewByIdDb = async(reviewID) => {
    const result = await db.query (
        "DELETE FROM reviews WHERE reviewID = $1",
        [reviewID]
    )
}

// CREATE
const addReviewLikeDb = async(reviewID, userID) => {
    const result = await db.query (
        "INSERT INTO reviewLikes (reviewID, userID) VALUES ($1, $2) RETURNING *",
        [reviewID, userID]
    )
    return result.rows
}

// READ
const getReviewLikeAmountDb = async(reviewID) => {
    const result = await db.query (
        "SELECT count(*) FROM reviewLikes WHERE reviewID = $1",
        [reviewID]
    )
    return result.rows[0].count
}

// READ
const getReviewLikeDb = async(reviewID, userID) => {
    const result = await db.query (
        "SELECT * FROM reviewLikes WHERE reviewID = $1 AND userID = $2",
        [reviewID, userID]
    )
    return result.rows
}

// DELETE
const deleteReviewLikeByIdDb = async(reviewID, userID) => {
    const result = await db.query (
        "DELETE FROM reviewLikes WHERE reviewID = $1 AND userID = $2",
        [reviewID, userID]
    )
}

export {
    getEventReviewsByEventIdDb,
    getEventReviewsByEventIdAndUserIdDb,
    getReviewByReviewIdDb,
    addReviewDb,
    editReviewByIdDb,
    deleteReviewByIdDb,
    addReviewLikeDb,
    getReviewLikeAmountDb,
    getReviewLikeDb,
    deleteReviewLikeByIdDb
}