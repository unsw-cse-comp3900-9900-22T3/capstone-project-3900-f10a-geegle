import { registerUserService, loginUserService } from '../services/auth.service.js'

// Controller layer to register a user
const registerUserController = async(req, res) => {
    try {
        const {user, token, statusCode, msg} = await registerUserService(req, res);

        if (!user) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({
                user,
                token,
                msg    
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("An error has occured")
    }
}

// Controller layer to login a user
const loginUserController = async(req, res) => {
    try {
        const {user, token, statusCode, msg} = await loginUserService(req, res);

        if (!user) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({
                user,
                token,
                msg 
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("An error has occured")
    }
}

// Controller response to verified token
const verifyUserTokenController = async(req, res) => {
    res.status(200).send("Verified")
}

export {
    registerUserController,
    loginUserController,
    verifyUserTokenController
}
