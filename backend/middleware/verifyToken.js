import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

export const verifyToken = async (req, res, next) => {
    const token = req.headers["auth-token"]

    if (!token) {
        return res.status(403).json({ msg: "User not authorised" })
    }

    try {
        const verify = jwt.verify(token, process.env.SECRET)
        /* Token data once decrypted
            { userID: 1234}
        */
        req.userID = verify.userID
        next()
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" })
    }
}