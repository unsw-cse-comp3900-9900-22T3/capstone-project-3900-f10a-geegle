import db from './db.js'


// READ query - gets a reply to a review
const getReplyByReviewIdDb = async(reviewID) => {
    const result = await db.query (
        "SELECT * FROM reviewReplies WHERE reviewID = $1", [reviewID]
    )
    return result.rows
}

// READ query - gets a reply by id
const getReplyByReplyIdDb = async(replyID) => {
    const result = await db.query (
        "SELECT * FROM reviewReplies WHERE replyID = $1", [replyID]
    )
    return result.rows
}

// READ query - gets the amount of replies to a review
const getReplyAmountByReviewIDDb = async(reviewID) => {
    const result = await db.query (
        'SELECT count(*) FROM reviewReplies WHERE reviewID = $1',
        [reviewID]
    )
    return result.rows[0].count
}

// CREATE query - adds a reply to a review
const addReplyDb = async(reviewID, userID, reply, repliedOn) => {
    const result = await db.query (
        "INSERT INTO reviewReplies (replyID, reviewID, userID, reply, repliedOn) VALUES " +
        "(default, $1, $2, $3, $4) RETURNING *", [reviewID, userID, reply, repliedOn]
    )
    return result.rows[0]
}

// UPDATE query - edits a reply
const editReplyByIdDb = async(replyID, reply, repliedOn) => {
    const result = await db.query (
        "UPDATE reviewReplies SET reply = $1, repliedOn = $2 WHERE replyID = $3 RETURNING *",
        [reply, repliedOn, replyID]
    )
    return result.rows[0]
}

// DELETE query - deletes a reply
const deleteReplyByIdDb = async(replyID) => {
    const result = await db.query (
        "DELETE FROM reviewReplies WHERE replyID = $1",
        [replyID]
    )
}

export {
    getReplyByReviewIdDb,
    getReplyByReplyIdDb,
    getReplyAmountByReviewIDDb,
    addReplyDb,
    editReplyByIdDb,
    deleteReplyByIdDb
}