import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {getUserByEmailDb, addUserDb} from '../db/user.db.js'

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
        return {user: null, token: null, statusCode : 401, err: 'Invalid Email'}
    }

    if (!validPassword(password)) {
        return {user: null, token: null, statusCode : 401, err: 'Invalid Password'}
    }

    const userByEmail = await getUserByEmailDb(email)
    if (userByEmail) {
        return {user: null, token: null, statusCode : 401, err: 'User Already Exists'}
    }

    const salt = await bcrypt.genSalt()
    const encryptPassword = await bcrypt.hash(password, salt)

    const newUser = await addUserDb(firstName, lastName, email, encryptPassword)
    
    return {user: newUser, token: "122313", statusCode : 201, err: null}
}


export { 
    registerUserService
}