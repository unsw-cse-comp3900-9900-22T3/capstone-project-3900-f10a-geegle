import { getUserProfileService, updateUserProfileService } from '../services/user.service.js'

const getUserProfileController = async (req, res) => {
    try {
        const { user, statusCode, msg } = await getUserProfileService(req, res)
        
        if (!user) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({user, msg})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("An error has occured: " + error.message)
    }
}

const updateUserProfileController = async (req, res) => {
    try {
        const { user, statusCode, msg } = await updateUserProfileService(req, res)
        
        if (!user) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({user, msg})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("An error has occured: " + error.message)
    }
}


export {
    getUserProfileController,
    updateUserProfileController
}