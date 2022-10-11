import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

/*
    Data format for user:
    { userID : 123 }
*/
export const generateNewToken = (data) => {
    return jwt.sign(data, process.env.SECRET, {expiresIn: "24hr"})
} 