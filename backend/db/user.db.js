import { resourceLimits } from 'worker_threads'
import db from './db.js'

// READ
const getUserByIdDb = async(Id) => {
    const result = await db.query (
        "SELECT * FROM users WHERE id = $1", [Id])
    return result.rows[0]
}

// READ
const getUserByEmailDb = async(email) => {
    const result = await db.query (
        "SELECT * FROM users WHERE email = $1", [email])
    return result.rows
}

// CREATE
const addUserDb = async(firstName, lastName, email, encryptPassword) => {
    const result = await db.query (
        "INSERT INTO users (userID, firstName, lastName, email, userPassword) " +
        "VALUES (default, $1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, encryptPassword]
    )
    return result.rows[0]
}

// DELETE
const removeUserByIdDb = async(Id) => {
    const result = await db.query (
        "DELETE FROM users WHERE userId = $1", [Id]
    )
}

// UPDATE
const updateUserPasswordByIdDb = async(newPassword, Id) => {
    const result = await db.query (
        "UPDATE users SET userPassword = $1 RETURNING *", [userPassword]
    )
    return result.rows[0]
}

export {
    getUserByIdDb,
    getUserByEmailDb,
    addUserDb,
    removeUserByIdDb,
    updateUserPasswordByIdDb
}