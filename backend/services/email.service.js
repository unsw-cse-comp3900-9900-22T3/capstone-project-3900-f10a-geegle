import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'
import * as eventdb from '../db/event.db.js'
import * as ticketPurchasedb from '../db/ticketpurchase.db.js'
import * as userdb from '../db/user.db.js'
import { addReplyDb } from '../db/reply.db.js'
import { getReviewByReviewIdDb } from '../db/review.db.js'
import nodemailer from 'nodemailer'
const { google } = require('googleapis');

/* Code source: https://github.com/trulymittal/gmail-api/blob/master/app.js */

// These id's and secrets should come from .env file.
const CLIENT_ID = '300746065947-uhtf3322436tvsv1c0gkq9oaho7a9o35.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04OqAeakX4E2VCgYIARAAGAQSNwF-L9IrRPU-aoXsCmMDkBsZVX2MVQYji_DAUvPzGdbLL3YrXIBdsJLpfBNooeDOthgq7UU0yYE';

// Setting up email credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Sending email for ticket purchase
export const sendEmailBookEventService = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const { tickets, seats, creditCard } = req.body;

        if (seats.length !== 0 && tickets.length !== seats.length) {
            return { booking: null, statusCode: 400, msg: "Number of tickets and seats selected not equal"}
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
        
        // DB: get all available tickets at event
        // https://stackoverflow.com/questions/3396088/how-do-i-remove-an-object-from-an-array-with-javascript
        let printSeats = ""
        const ticketPurchases = []
        for (let i = 0; i < tickets.length; i++) {
            let ticketResult = await ticketdb.getAvailableTicketsByTicketTypeDb(eventID, tickets[i])
            if (ticketResult.length === 0) {
                continue
            } 

            ticketResult = ticketResult[0]
            if (seats.length !== 0) {
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
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
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

// Send email for ticket cancellation
export const sendEmailcancelEventUserBookingService = async(req, res) => {
    try {
        
        await venueSeatingdb.unassignSeatFromTicketDb(req.params.ticketID)
        await ticketPurchasedb.removeTicketPurchaseByTicketIdDb(req.params.ticketID)

        const eventID = req.params.eventID
        const userID = req.userID

        // Get email info
        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)

        // Send email
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
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

// Send email for host sending email announcement to all ticket purchasers
export const sendEmailEventAnnouncement = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const {announcement} = req.body;

        // Get email info
        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)

        // Send email
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
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
            <p>Dear ${user.firstname}, <br><br> The host of ${event[0].eventname} has made the following announcement <blockquote> <i>"${announcement}"</i> </blockquote> <br><br><br><br><br></p>
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

export const sendEmailunpublishEventsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const event = await getEventByIdDb(eventID);
        if (event.length != 1) {
            return {events: null, statusCode : 404, msg: 'Event does not exist'}
        }
        if (req.userID != event[0].hostid) {
            return {events: null, statusCode : 403, msg: 'You are not the owner of this event'}
        }
        if (!event[0].published) {
            return {events: null, statusCode : 400, msg: 'Event is already unpublished'}
        }
        const unpublishedEvent = await unpublishEventByIdDb(eventID);

        // Getting guest list details to send event cancellation email
        const guests = await getEventGuestListByIdDb(eventID)

        // Send email
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
        }); 
        
        for (let guest of guests) {
            var mailOptions = {
                from: 'eventful.geegle@gmail.com',
                to: guest.email,
                subject: 'Event Cancellation: ' + event[0].eventname,
                html: 

                `<body>
                <font face = "arial">
                <p style="background-color:rgb(118, 43, 255);"><br></p>
                <center> <img  src="https://cdn.evbstatic.com/s3-build/824432-rc2022-11-07_16.04-c8310df/django/images/logos/eb_orange_on_white_1200x630.png" alt="Flowers in Chania" width="460" height="345"> </center>
                <p>Dear ${guest.firstname}, <br><br> We regret to inform you that ${event[0].eventname} has been cancelled. </b> <br> <br> Tickets will be automatically refunded in full (including refundable ticket purchase, if relevant) to the original payment method used for purchase and patrons do not need to take any action. <br> <br> Patrons should allow approximately 30 business days for the refund to appear in their account. <br> <br> Kind regards, <br><br> The Eventful Team <br><br><br><br><br></p>
                <center>
                <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
                </font>
                </body>
                `
                };

            await transporter.sendMail(mailOptions)
        }

        return {events: {
                    eventID: unpublishedEvent.eventid,
                    published: unpublishedEvent.published
                },
                statusCode : 200, 
                msg: 'Event Unpublished'}

    } catch(e) {
        throw e
    }
}

export const sendEmailcreateReviewReplyService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const {reply} = req.body;
        
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {replies: null, statusCode: 400, msg: 'Review does not exist'}
        }

        if (reply == '') {
            return {replies: null, statusCode: 400, msg: 'Reply contains no content'}
        }

        const newReply = await addReplyDb(reviewID, req.userID, reply, new Date(Date.now()));
        const username = await getUserByIdDb(newReply.userid);

        const eventID = req.params.eventID
        const userID = req.userID

        // Get details of the customer who left the original review
        const reviewUser = await userdb.getUserByIdDb(review[0].userid)
        const event = await eventdb.getEventByIdDisplayDb(review[0].eventid)

        // Send email
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'eventful.geegle@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
        });

        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: reviewUser.email,
            subject: 'Ticket Refund: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="https://cdn.evbstatic.com/s3-build/824432-rc2022-11-07_16.04-c8310df/django/images/logos/eb_orange_on_white_1200x630.png" alt="Flowers in Chania" width="460" height="345"> </center>
            <p>Dear ${reviewUser.firstname}, <br><br> ${username.firstname} has replied to your review: <blockquote> <i>"${reply}"</i> </blockquote> <br><br><br><br><br></p>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`
           
            };

        await transporter.sendMail(mailOptions)

        return {replies: {
            replyID: newReply.replyid,
            reviewID: newReply.reviewid,
            reply: newReply.reply,
            repliedOn: newReply.repliedon,
            userID: newReply.userid,
            user: username.firstname + " " + username.lastname
        },
        statusCode : 201, 
        msg: 'Reply Created'}
    } catch (e) {
        throw e
    }
}


