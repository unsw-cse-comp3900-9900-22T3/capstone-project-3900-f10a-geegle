import {registerUserService} from '../services/auth.service.js'

const registerUserController = async(req, res) => {
    try {
        const userResponse = await registerUserService(req, res)
        res.status(201).json(userResponse)
    } catch (e) {
        return res.status(500).end()
    }
    
    
}

export {
    registerUserController
}
