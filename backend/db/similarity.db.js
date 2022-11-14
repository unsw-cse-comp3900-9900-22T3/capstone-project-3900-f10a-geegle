import db from './db.js'

// CREATE
const addEventSimilarityById = async(ID1, ID2, rating) => {
    const result = await db.query (
        "INSERT INTO eventSimilarity (event1, event2, similarity_rating)" +
        "VALUES ($1, $2, $3) ON CONFLICT (event1, event2) DO UPDATE " +
        "SET similarity_rating = EXCLUDED.similarity_rating RETURNING *", 
        [ID1, ID2, rating]
    )
    return result.rows[0]
}

// READ
const getEventSimilarityById = async(ID1, ID2) => {
    const result = await db.query (
        "SELECT * FROM eventSimilarity WHERE event1 = $1 and event2 = $2", 
        [ID1, ID2]
    )
    return result.rows
}

export {
    addEventSimilarityById,
    getEventSimilarityById
}