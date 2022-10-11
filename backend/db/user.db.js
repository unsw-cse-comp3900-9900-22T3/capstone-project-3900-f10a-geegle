import db from './db.js'

const getUserByIdDb = async(Id) => {
    const result = await db.query (
        "SELECT * FROM users WHERE id = $1", [Id])
    return result.rows[0]
}

const getUserByEmailDb = async(email) => {
    const result = await db.query (
        "SELECT * FROM users WHERE email = $1", [email])
    return result.rows[0]
}

const addUserDb = async(firstName, lastName, email, encryptPassword) => {
    const result = await db.query (
        "INSERT INTO users (userID, firstName, lastName, email, userPassword) " +
        "VALUES (default, $1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, encryptPassword]
    )
    return result.rows[0]
}

export {
    getUserByEmailDb,
    addUserDb
}