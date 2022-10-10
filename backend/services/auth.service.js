import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {getUserByEmailDb, addUserDb} from '../db/user.db.js'
import {generateNewToken} from '../utils/auth.helper.js'

const validEmail = (email) => {
    const validEmail =  /(.+)@(.+){2,}\.(.+){2,}/.test(email)
    return validEmail
}

const validPassword = (password) => {
    // Add additional complexity reqs for password
    const validPassword = password.trim().length >= 8 
    return validPassword
}

const registerUserService = async(req, res) => {
    try {    
        const {firstName, lastName, email, password} = req.body
        if (!validEmail(email)) {
            return res.status(401).json({error: 'Invalid Email'}).end()
        }
        if (!validPassword(password)) {
            return res.status(401).json({error: 'Invalid Password'}).end()
        }
        
        // This does not work apparently
        const usersWithEmail = await getUserByEmailDb(email)
        if (usersWithEmail > 0) {
            return res.status(401).json({error: 'User Already Exists'}).end()
        }
        const salt = await bcrypt.genSalt()
        const encryptPassword = await bcrypt.hash(password, salt)

        const newUser = await addUserDb(firstName, lastName, email, encryptPassword)
        const newToken = generateNewToken(newUser.userID, res)

        return {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            token: newToken
        }
    } catch (e) {
        loggger.err(e)
    }
}


export { 
    registerUserService
}