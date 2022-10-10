import {registerUserService} from '../services/auth.service.js'

const registerUserController = async(req, res) => {
    const {user, token} = await registerUserService(req, res);
    res.status(201).json({
        user,
        token    
    })
}

export {
    registerUserController
}
