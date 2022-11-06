import * as userDb from '../db/user.db.js'
import * as ticketpurchaseDb from '../db/ticketpurchase.db.js'
import { isSeatedEventDb } from '../db/event.db.js'
import bcrypt from 'bcrypt'

const getUserProfileService = async (req, res) => {
    if (req.params.userID != req.userID) {
        return { user: null, statusCode : 403, msg: 'No permission to access this user\'s profile' }
    }

    try {
        const user = await userDb.getUserByIdDb(req.params.userID)
        const tickets = await ticketpurchaseDb.getUserTicketsdDb(req.params.userID)
        const getUser = {
                            user: {
                                firstName: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                            },
                            statusCode: 200,
                            msg: 'User profile details sent'
                        }
        
        getUser.user.tickets = []
        for (const ticket of tickets) {
            const seating = await isSeatedEventDb(ticket.eventid)
            getUser.user.tickets.push({
                ticketID: ticket.ticketid,
                ticketType: ticket.tickettype,
                price: ticket.price,
                seat: seating.length > 0 ? 
                        {seatID: ticket.seatid, seatSection: ticket.seatsection, seatRow: ticket.seatrow, seatNo: ticket.seatno } : null,
                eventName: ticket.eventname,
                venueName: ticket.venuename,
                eventLocation: ticket.venuelocation,
                eventStartDateTime: ticket.eventstartdatetime
            })
        }
        
        const userCreditCard = await userDb.getUserCreditCardbyIdDb(req.params.userID)
        if (userCreditCard.length == 1) {
            getUser.user.creditCard = {
                                    creditCardNum: userCreditCard[0].creditcardnum,
                                    ccv: userCreditCard[0].ccv,
                                    expiryMonth: userCreditCard[0].expirymonth,
                                    expiryYear: userCreditCard[0].expiryyear
                                 }
        }

        return getUser
    } catch (err) {
        throw err
    }
    
}

const updateUserProfileService = async (req, res) => {
    if (req.params.userID != req.userID) {
        return { user: null, statusCode : 403, msg: 'No permission to access this user\'s profile' }
    }

    const { firstName, lastName, email, password, creditCard } = req.body
    /*
        The null values received from req.body is of type object rather than null so use !!
        console.log(typeof firstName, null)
    */
    try {
        let updatedUser = await userDb.getUserByIdDb(req.params.userID)
    
        if (!!firstName) {
            updatedUser = await userDb.updateUserFirstNameByIdDb(firstName, req.params.userID)
        }

        if (!!lastName) {
            updatedUser = await userDb.updateUserLastNameByIdDb(lastName, req.params.userID)
        }

        if (!!email) {
            updatedUser = await userDb.updateUserEmailByIdDb(email, req.params.userID)
        }

        /*
            password: {
                oldPassword: "",
                newPassword: ""
            }
        */
        if (!!password) {
            const match = await bcrypt.compare(password.oldPassword, updatedUser.userpassword)
            if (!match) {
                return {user: 
                            {
                                firstName: updatedUser.firstname,
                                lastName: updatedUser.lastname,
                                email: updatedUser.email,
                            }, 
                        statusCode : 400, 
                        msg: 'Original password entered is incorrect'}
            }

            const salt = await bcrypt.genSalt()
            const encryptPassword = await bcrypt.hash(password.newPassword, salt)
            updatedUser = await userDb.updateUserPasswordByIdDb(encryptPassword, req.params.userID)
        }

        /*
            creditCard: {
                creditCardNum: string,
                ccv: string,
                expiryMonth: string,
                expiryYear: string
            }
        */
        let updatedCreditCard
        if (!!creditCard) {
            if (!checkValidCreditCard(creditCard.creditCardNum, creditCard.ccv, creditCard.expiryMonth, creditCard.expiryYear)) {
                return {user: 
                            {
                                firstName: updatedUser.firstname,
                                lastName: updatedUser.lastname,
                                email: updatedUser.email,
                            }, 
                        statusCode : 400, 
                        msg: 'Invalid Credit Card Details'}
            }

            const userCreditCard = await userDb.getUserCreditCardbyIdDb(req.params.userID)
            if (userCreditCard.length == 1) {
                updatedCreditCard = await userDb.updateUserCreditCardByIdDb(creditCard.creditCardNum, creditCard.ccv, 
                                            creditCard.expiryMonth, creditCard.expiryYear, req.params.userID)
            } else {
                updatedCreditCard = await userDb.addUserCreditCardDb(creditCard.creditCardNum, creditCard.ccv, 
                    creditCard.expiryMonth, creditCard.expiryYear, req.params.userID)
            } 
        }

        const returnUser = {
                                user: {
                                    firstName: updatedUser.firstname,
                                    lastName: updatedUser.lastname,
                                    email: updatedUser.email
                                },
                                statusCode: 200,
                                msg: 'Update User Success!'
                            }
        
        if (!!creditCard) {
            returnUser.user.creditCard = {
                                            creditCardNum: updatedCreditCard.creditcardnum,
                                            ccv: updatedCreditCard.ccv,
                                            expiryMonth: updatedCreditCard.expirymonth,
                                            expiryYear: updatedCreditCard.expiryyear
                                        }
        }

        return returnUser
    } catch (error) {
        throw error
    }
    
}

const checkValidCreditCard = (cardNo, ccv, expiryMonth, expiryYear) => {
    const regexCardNo = new RegExp('^[0-9]{16}$')
    const regexCCV = new RegExp('^[0-9]{3}$')
    const regexMonth = new RegExp('^[0-1][0-9]$')
    const regexYear = new RegExp('^[0-9]{2}$')
    
    return (regexCardNo.test(cardNo)       && 
            regexCCV.test(ccv)             &&
            regexMonth.test(expiryMonth)   && 
            parseInt(expiryMonth) <= 12     && 
            regexYear.test(expiryYear)) 
}

export {
    getUserProfileService,
    updateUserProfileService
}