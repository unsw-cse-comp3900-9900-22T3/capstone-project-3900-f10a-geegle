import {registerUserService} from '../services/auth.service.js'

const registerUserController = async(req, res) => {
    const {user, token, statusCode, err} = await registerUserService(req, res);

    if (!user) {
        res.status(statusCode).json(err)
    } else {
        res.status(statusCode).json({
            user,
            token    
        })
    }
}

export {
    registerUserController
}
