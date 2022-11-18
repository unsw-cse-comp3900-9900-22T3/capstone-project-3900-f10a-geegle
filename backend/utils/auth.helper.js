import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

/*
    Data format for user:
    { userID : 123 }
*/
// Generates a new token for a user
export const generateNewToken = (data) => {
    return jwt.sign(data, process.env.SECRET, {expiresIn: "24hr"})
} 