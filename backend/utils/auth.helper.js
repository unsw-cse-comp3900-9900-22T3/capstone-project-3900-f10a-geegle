import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

export const generateNewToken = (userID, res) => {
    try {
        return jwt.sign(userID, "2131323", {expiresIn: "24hr"})
    } catch (e) {
        res.status(401).json({error: "Token could not be generated"})
    }

}

export const verifyToken = (token, res) => {
    try {
        // Only can be decrypted with correct hash
        return jwt.verify(token, process.env.SECRET)
    } catch (e) {
        res.status(401).json({error: "Invalid token"})
    }
} 