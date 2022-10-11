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
    const {firstName, lastName, email, password} = req.body
    if (!validEmail(email)) {
        return {user: null, token: null, statusCode : 401, msg: 'Invalid Email'}
    }

    if (!validPassword(password)) {
        return {user: null, token: null, statusCode : 401, msg: 'Invalid Password'}
    }

    try {
        const userByEmail = await getUserByEmailDb(email)
        if (userByEmail.length > 0) {
            return {user: null, token: null, statusCode : 401, msg: 'User Already Exists'}
        }

        const salt = await bcrypt.genSalt()
        const encryptPassword = await bcrypt.hash(password, salt)

        const newUser = await addUserDb(firstName, lastName, email, encryptPassword)
        delete newUser.userpassword
        
        // Getting query result from database turns all object keys to lowercase
        const newToken = generateNewToken({ userID : newUser.userid })

        return {user: { userID : newUser.userid,
                        firstName: newUser.firstname,
                        lastName: newUser.lastname,
                        email: newUser.email }, 
                token: newToken, 
                statusCode : 201, 
                msg: "Register success!"}
    } catch (error) {
        throw error
    }
    
}

const loginUserService = async(req, res) => {
    const { email, password } = req.body
    if (!validEmail(email)) {
        return {user: null, token: null, statusCode : 401, msg: 'Invalid Email'}
    }

    try {
        const userByEmail = await getUserByEmailDb(email)
        if (userByEmail.length == 0) {
            return {user: null, token: null, statusCode : 401, msg: 'Email Does Not Exist'}
        }
        
        const match = await bcrypt.compare(password, userByEmail[0].userpassword)
        if (!validPassword(password) || !match) {
            return {user: null, token: null, statusCode : 401, msg: 'Invalid Password'}
        }
    
        const newToken = generateNewToken({ userID : userByEmail[0].userid })
    
        return {user: { userID : userByEmail[0].userid,
                        firstName: userByEmail[0].firstname,
                        lastName: userByEmail[0].lastname,
                        email: userByEmail[0].email }, 
                token: newToken, 
                statusCode : 200, 
                msg: "Login success!"}
    } catch (error) {
        throw error
    }
}


export { 
    registerUserService,
    loginUserService
}