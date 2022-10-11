import { registerUserService, loginUserService } from '../services/auth.service.js'

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

const verifyUserTokenController = async(req, res) => {
    res.status(200).send("Verified")
}

export {
    registerUserController,
    loginUserController,
    verifyUserTokenController
}
