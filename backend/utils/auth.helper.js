import jwt from 'jsonwebtoken'

export const generateNewToken = (userID, res) => {
    try {
        return jwt.sign(userID, "hello", {expiresIn: "24hr"})
    } catch (e) {
        res.status(401).json({error: "Token could not be generated"})
    }

}

export const verifyToken = (token, res) => {
    try {
        // Only can be decrypted with correct hash
        return jwt.verify(token, config.secret.jwt)
    } catch (e) {
        res.status(401).json({error: "Invalid token"})
    }
} 