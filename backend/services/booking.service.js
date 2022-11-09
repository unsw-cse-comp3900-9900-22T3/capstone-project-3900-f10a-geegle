import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'
import * as eventdb from '../db/event.db.js'
import * as ticketPurchasedb from '../db/ticketpurchase.db.js'
import * as userdb from '../db/user.db.js'
import nodemailer from 'nodemailer'

export const getEventTicketTypesService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const ticketTypes = await ticketdb.getTicketTypesByEventIdDb(eventID)
        
        for (let ticketInfo of ticketTypes) {
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
        }
        
        return {tickets: ticketTypes,
                statusCode: 200,
                msg: `Ticket types for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventTicketsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getTicketByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketID'] = ticketInfo['ticketid']
            delete ticketInfo['ticketid']
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
            ticketInfo['seatID'] = ticketInfo['seatid']
            delete ticketInfo['seatid']
            delete ticketInfo['eventid']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableTicketService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getAvailableTicketsByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketID'] = ticketInfo['ticketid']
            delete ticketInfo['ticketid']
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Available tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableTicketGroupService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const tickets = await ticketdb.getAvailableTicketTypeGroupByEventIdDb(eventID)
        
        for (let ticketInfo of tickets) {
            ticketInfo['ticketType'] = ticketInfo['tickettype']
            delete ticketInfo['tickettype']
            ticketInfo['remaining'] = ticketInfo['count']
            delete ticketInfo['count']
        }

        return {tickets: tickets,
                statusCode: 200,
                msg: `Available tickets for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenueSeatsByEventIdDb(eventID)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `All seats for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenueAvailableSeatsByEventIdDb(eventID)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `Available seats for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventPurchasedSeatsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seats = await venueSeatingdb.getVenuePurchasedSeatsByEventIdDb(eventID)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `Purchased seats for Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventAvailableSeatsByTicketTypeService = async(req, res) => {
    try {
        const { eventID, ticketType } = req.params;
        const seats = await venueSeatingdb.getVenueAvailableSeatsByEventIdAndTicketTypeDb(eventID, ticketType)
        
        for (let seat of seats) {
            seat['seatID'] = seat['seatid']
            delete seat['seatID']
            seat['seatSection'] = seat['seatsection']
            delete seat['seatsection']
            seat['seatRow'] = seat['seatrow']
            delete seat['seatrow']
            seat['seatNo'] = seat['seatno']
            delete seat['seatno']
        }

        return {seats: seats,
                statusCode: 200,
                msg: `Available seats for Event ${eventID} and ticket type ${ticketType}`}

    } catch (error) {
        throw error
    }
}

export const getEventVenueSeatSectionsService = async(req, res) => {
    try {
        const venueName = req.params.venueName;
        const seats = await venueSeatingdb.getVenueSeatSectionsByVenueNameDb(venueName)
        
        return {seatSections: seats.map(seat => seat.seatsection),
                statusCode: 200,
                msg: `Seat sections at venue ${venueName}`}

    } catch (error) {
        throw error
    }
}

export const getEventSeatSectionTicketAllocationService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const seatSectionsDb = await eventdb.getEventSeatSectionTicketAllocationDb(eventID)
        
        const seatSection = {}
        for (let ss of seatSectionsDb) {
            if (ss.seatsection in seatSection) {
                seatSection[ss.seatsection].push(ss.tickettype)
            } else {
                seatSection[ss.seatsection] = [ss.tickettype]
            } 
        }

        return {seatSections: seatSection,
                statusCode: 200,
                msg: `Ticket types allocated to seat sections at Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const getEventSeatInfoService = async(req, res) => {
    try {
        const { eventID, seatID } = req.params;
        const seat = await venueSeatingdb.getVenueSeatInfoByEventIdDb(eventID, seatID)

        seat['seatID'] = seat['seatid']
        delete seat['seatID']
        seat['seatSection'] = seat['seatsection']
        delete seat['seatsection']
        seat['seatRow'] = seat['seatrow']
        delete seat['seatrow']
        seat['seatNo'] = seat['seatno']
        delete seat['seatno']
        seat['ticketType'] = seat['tickettype']
        delete seat['tickettype']

        const occupied = await venueSeatingdb.getSeatOccupantDb(eventID, seat.seatID)
        console.log(occupied)
        if (occupied.length == 1) {
            seat['available'] = false
        } else {
            seat['available'] = true
        }

        return {seat: seat,
                statusCode: 200,
                msg: `Seat information for Seat ${seat.seatID} in Event ${eventID}`}

    } catch (error) {
        throw error
    }
}

export const bookEventService = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const { tickets, seats, creditCard } = req.body;

        if (seats.length !== 0 && tickets.length !== seats.length) {
            return { booking: null, statusCode: 400, msg: "Number of tickets and seats selected not equal"}
        }

        // Check credit card correct
        if (creditCard.useStored) {
            const cc = await userdb.getUserCreditCardbyIdDb(userID)
            if (cc.length === 0) {
                return { booking: null, statusCode: 400, msg: "User has no credit card saved"}
            }
        } else if (!checkValidCreditCard(creditCard.creditCardNum, creditCard.ccv, creditCard.expiryMonth, creditCard.expiryYear)) {
            return { booking: null, statusCode: 400, msg: "Invalid credit card details"}
        }

        // Check no. of tickets booked of each type are available
        let count = {}
        for (const ticketType of tickets) {
            count[ticketType] = count[ticketType] ? count[ticketType] + 1 : 1
        }
        
        for (const ticketType in count) {
            const available = await ticketdb.getAvailableTicketsCountByTicketTypeDb(eventID, ticketType)
            if (count[ticketType] > available.count) {
                return { booking: null, statusCode: 400, msg: `Insufficient tickets available for ticketType '${ticketType}'`}
            }
        }
        
        // Check seat not taken + ticketType can sit in that seat section
        for (let i = 0; i < seats.length; i++) {
            let seatFromDB = await venueSeatingdb.getSeatOccupantDb(eventID, seats[i])
            if (seatFromDB.length !== 0) {
                return { booking: null, statusCode: 400, msg: `Seat '${seats[i]}' already taken`}
            }
            
            const allowed = await venueSeatingdb.isSeatInSeatSectionAllocatedToTicketTypeDb(eventID, seats[i], tickets[i])
            
            if (allowed.length === 0) {
                return { booking: null, statusCode: 400, msg: `Seat '${seats[i]}' cannot be chosen for ticket type: '${tickets[i]}'`}
            }
        }
        
        // DB: get all available tickets at event
        // https://stackoverflow.com/questions/3396088/how-do-i-remove-an-object-from-an-array-with-javascript
        // - Use array.findIndex to find ticket matching the ticket type
        // - Delete from available tickets

        // Alternative: each iteration get from DB list of available tickets
        /*
            For each booking:
                
                - Get a ticketID based on ticketType
                - Add seatID to the ticket
                - Add to ticketPurchases table
                
        */
        let printSeats = ""
        const ticketPurchases = []
        for (let i = 0; i < tickets.length; i++) {
            let ticketResult = await ticketdb.getAvailableTicketsByTicketTypeDb(eventID, tickets[i])
            if (ticketResult.length === 0) {
                continue
            } 

            ticketResult = ticketResult[0]
            if (seats.length !== 0) {
                // implement this
                ticketResult = await ticketdb.assignSeatToTicketDb(ticketResult.ticketid, seats[i])
                const seatInfo = await venueSeatingdb.getSeatBySeatId(seats[i])
                printSeats += `Section: ${seatInfo[0].seatsection} Row:${seatInfo[0].seatrow} Number: ${seatInfo[0].seatno} <br>`
            }

            const ticketPurchase = await ticketdb.addTicketPurchaseDb(ticketResult.ticketid, userID, new Date())
            
            ticketPurchases.push({  ticketID: ticketResult.ticketid,
                                    ticketType: ticketResult.tickettype,
                                    price: ticketResult.price,
                                    eventID: ticketResult.eventid,
                                    seatID: ticketResult.seatid,
                                    userID: ticketPurchase.userid,
                                    ticketPurchaseTime: ticketPurchase.ticketpurchasetime })
            
        }
        

        // Get email info
        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)

        let printTickets = ""

        for (const ticket in count) {
            const price = await ticketdb.getTicketPriceByTicketType(ticket, eventID)
            printTickets +=
            `<tr style= "vertical-align:top">
            <td>${count[ticket]}x </td>
            <td>${ticket} <br> <p style="color:DimGray;"><i> AUD ${price.price} per ticket </i></p> </td>
            <td>AUD $ ${parseInt(price.price) * count[ticket]}</td>
            </tr>`
            totalCost += parseInt(price.price) * count[ticket]
        }

        // Send email
        var CLIENT_ID = 
        "300746065947-uhtf3322436tvsv1c0gkq9oaho7a9o35.apps.googleusercontent.com"
        var CLIENT_SECRET = 
            "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"

    
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            accessToken: 
                "ya29.a0AeTM1icCdLpbkqaWXg3DUMzkEQq6aMzDIOG-EiEp4aOG7BVgRoPXShe2EvfjtUsvgaM0a06nt-G7WeGNp4MERzkvRyLp4t151_NM2RbSCjjhVVNYH-FW8lYyMqrxL1jxUKAQ8MRwAm4Cji-Q2y_aC8HyU1JraCgYKAXISARASFQHWtWOmvlunP7_eAZg5LlKmo8YU8w0163"
        }
        }); 


        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: user.email,
            subject: 'Booking Confirmation: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="../utils/logo.png" alt="Eventful logo"> </center>
            <p>Dear ${user.firstname}, <br><br> Thank you for your purchase to ${event[0].eventname}. Please find a summary of your order below: <br> <br> <hr> <br> </p>
            <div>
            <center> 
            <img  src="https://d35kvm5iuwjt9t.cloudfront.net/dbimages/sfx277987.jpg" alt="Flowers in Chania" width="460" height="345">
            <h1> ${event[0].eventname} </h1>
            <p> ${event[0].venuename} <br> ${event[0].startdatetime} - ${event[0].enddatetime}  <br> Seating Information: ${printSeats} </p>
            </center>
            <div>
            <h2> <hr> <br> Order Summary </h2>
            <table style="width:100%; background-color:rgb(244, 239, 255)" >
            ${printTickets}
            <tr style= "vertical-align:top">
            <td><b> Total Cost </td>
            <td><br> <p style="color:DimGray;"><i> AUD ${price.price} per ticket </i></p> </td>
            <td>AUD $ ${totalCost}</td>
            </tr>
            </table>
            <br><hr><br>
            <p> Locate your tickets in your Eventful account online. Your tickets will be emailed to you or available for print. </p>
            <br>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`
           
            };

        await transporter.sendMail(mailOptions)

        return { booking: ticketPurchases, statusCode: 200, msg: `Tickets purchased to Event ${eventID}`}

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

export const getEventTicketsUserPurchasedService = async(req, res) => {
    try {
        const userID = req.userID
        const eventID = req.params.eventID
        const tickets = await ticketPurchasedb.getTicketPurchaseByUserIdDb(eventID, userID) 
        
        for (const ticket of tickets) {
            ticket['ticketID'] = ticket['ticketid']
            delete ticket['ticketid']
            ticket['ticketType '] = ticket['tickettype ']
            delete ticket['tickettype']
            ticket['eventID'] = ticket['eventid']
            delete ticket['eventid']
            ticket['seatID'] = ticket['seatid']
            delete ticket['seatid']
            ticket['userID'] = ticket['userid']
            delete ticket['userid']
            ticket['ticketPurchaseTime'] = ticket['ticketpurchasetime']
            delete ticket['ticketpurchasetime']
        }

        return { tickets: tickets, statusCode: 200, msg: `User ${userID} tickets to Event ${eventID}`}
    } catch (error) {
        throw error
    }
}

export const cancelEventUserBookingService = async(req, res) => {
    try {
        
        await venueSeatingdb.unassignSeatFromTicketDb(req.params.ticketID)
        await ticketPurchasedb.removeTicketPurchaseByTicketIdDb(req.params.ticketID)

        const eventID = req.params.eventID
        const userID = req.userID

        // Get email info
        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)

        // Send email
        var CLIENT_ID = 
        "300746065947-uhtf3322436tvsv1c0gkq9oaho7a9o35.apps.googleusercontent.com"
        var CLIENT_SECRET = 
            "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"

    
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            accessToken: 
                "ya29.a0AeTM1icCdLpbkqaWXg3DUMzkEQq6aMzDIOG-EiEp4aOG7BVgRoPXShe2EvfjtUsvgaM0a06nt-G7WeGNp4MERzkvRyLp4t151_NM2RbSCjjhVVNYH-FW8lYyMqrxL1jxUKAQ8MRwAm4Cji-Q2y_aC8HyU1JraCgYKAXISARASFQHWtWOmvlunP7_eAZg5LlKmo8YU8w0163"
        }
        }); 
        

        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: user.email,
            subject: 'Ticket Refund: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="https://cdn.evbstatic.com/s3-build/824432-rc2022-11-07_16.04-c8310df/django/images/logos/eb_orange_on_white_1200x630.png" alt="Flowers in Chania" width="460" height="345"> </center>
            <p>Dear ${user.firstname}, <br><br> Your refund request has been processed for ${event[0].venuename}.  <b> You will be refunded the full amount to the account that was used to for the ticket purchase. </b> <br> <br> Tickets will be automatically refunded in full (including refundable ticket purchase, if relevant) to the original payment method used for purchase and patrons do not need to take any action. <br> <br> Patrons should allow approximately 30 business days for the refund to appear in their account. <br><br> <br> Kind regards, <br><br> The Eventful Team <br><br><br><br><br> </p>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`
           
            };

        await transporter.sendMail(mailOptions)

        return {statusCode: 200, msg: `Ticket ${req.params.ticketID} has been cancelled`}

    } catch (error) {
        throw error
    }
}