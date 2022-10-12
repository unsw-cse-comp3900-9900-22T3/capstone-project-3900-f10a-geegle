import db from './db.js'

// READ
const getUserByIdDb = async(Id) => {
    const result = await db.query (
        "SELECT * FROM users WHERE userID = $1", [Id])
    return result.rows[0]
}

// READ
const getUserByEmailDb = async(email) => {
    const result = await db.query (
        "SELECT * FROM users WHERE email = $1", [email])
    return result.rows
}

// READ
const getUserCreditCardbyIdDb = async(Id) => {
    const result = await db.query (
        "SELECT * FROM creditCardDetails WHERE userID = $1", [Id])
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
        "DELETE FROM users WHERE userID = $1", [Id]
    )
}

// UPDATE
const updateUserFirstNameByIdDb = async(firstName, Id) => {
    const result = await db.query (
        "UPDATE users SET firstName = $1 WHERE userID = $2 RETURNING *", [firstName, Id]
    )
    return result.rows[0]
}

// UPDATE
const updateUserLastNameByIdDb = async(lastName, Id) => {
    const result = await db.query (
        "UPDATE users SET lastName = $1 WHERE userID = $2 RETURNING *", [lastName, Id]
    )
    return result.rows[0]
}

// UPDATE
const updateUserPasswordByIdDb = async(password, Id) => {
    const result = await db.query (
        "UPDATE users SET userPassword = $1 WHERE userID = $2 RETURNING *", [password, Id]
    )
    return result.rows[0]
}

// UPDATE
const updateUserEmailByIdDb = async(email, Id) => {
    const result = await db.query (
        "UPDATE users SET email = $1 WHERE userID = $2 RETURNING *", [email, Id]
    )
    return result.rows[0]
}

// UPDATE
const updateUserCreditCardByIdDb = async(cardNumber, ccv, expiryMonth, expiryYear, Id) => {
    const result = await db.query(
        "UPDATE creditCardDetails " + 
        "SET "                      + 
        "creditCardNum = $1, "      + 
        "ccv = $2, "                +
        "expiryMonth = $3, "        +
        "expiryYear = $4 "          +
        "WHERE userID = $5 RETURNING *", 
        [cardNumber, ccv, expiryMonth, expiryYear, Id])
    return result.rows[0]
}

// INSERT
const addUserCreditCardDb = async(cardNumber, ccv, expiryMonth, expiryYear, Id) => {
    const result = await db.query(
        "INSERT INTO creditCardDetails (creditCardNum, ccv, expiryMonth, expiryYear, userID) " +
        "VALUES ($1, $2, $3, $4, $5) RETURNING *", 
        [cardNumber, ccv, expiryMonth, expiryYear, Id])
    return result.rows[0]
}

export {
    getUserByIdDb,
    getUserByEmailDb,
    getUserCreditCardbyIdDb,
    addUserDb,
    removeUserByIdDb,
    updateUserFirstNameByIdDb,
    updateUserLastNameByIdDb,
    updateUserPasswordByIdDb,
    updateUserEmailByIdDb,
    updateUserCreditCardByIdDb,
    addUserCreditCardDb
}