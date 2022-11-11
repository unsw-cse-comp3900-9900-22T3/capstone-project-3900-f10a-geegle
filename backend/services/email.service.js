import * as ticketdb from '../db/ticket.db.js'
import * as venueSeatingdb from '../db/venueSeating.db.js'
import * as eventdb from '../db/event.db.js'
import * as ticketPurchasedb from '../db/ticketpurchase.db.js'
import * as userdb from '../db/user.db.js'
import { addReplyDb } from '../db/reply.db.js'
import { getReviewByReviewIdDb } from '../db/review.db.js'
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* Code source: https://github.com/trulymittal/gmail-api/blob/master/app.js */

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eventful.geegle@gmail.com',
        pass: process.env.GMAILPW
    }
});

// Sending email for ticket purchase
export const bookEventService = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const { booking } = req.body;

        // Get email info
        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)

        let count = {}
        let printSeats = ""
        for (const ticket of booking) {
            count[ticket.ticketType] = count[ticket.ticketType] ? count[ticket.ticketType] + 1 : 1
            if (ticket.seatID !== null) {
                const seatInfo = await venueSeatingdb.getSeatBySeatId(ticket.seatID)
                printSeats += `Section: ${seatInfo[0].seatsection} Row: ${seatInfo[0].seatrow} Number: ${seatInfo[0].seatno} <br>`
            }
        }

        let printTickets = ""
        let totalCost = 0
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


        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: user.email,
            subject: 'Booking Confirmation: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="cid:logo" alt="Eventful logo"> </center>
            <p>Dear ${user.firstname}, <br><br> Thank you for your purchase to ${event[0].eventname}. Please find a summary of your order below: <br> <br> <hr> <br> </p>
            <div>
            <center> 
            <img  src="cid:eventImage">
            <h1> ${event[0].eventname} </h1>
            <p> ${event[0].venuename} <br> ${event[0].startdatetime} - ${event[0].enddatetime}  <br> Seating Information: <br>${printSeats} </p>
            </center>
            <div>
            <h2> <hr> <br> Order Summary </h2>
            <table style="width:100%; background-color:rgb(244, 239, 255)" >
            ${printTickets}
            <tr style= "vertical-align:top">
            <td><b> Total Cost </td>
            <td>AUD $ ${totalCost}</td>
            </tr>
            </table>
            <br><hr><br>
            <p> Locate your tickets in your Eventful account online. Your tickets will be emailed to you or available for print. </p>
            <br>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/logo.png',
                cid: 'logo'
            }, 
            {   // encoded string as an attachment
                filename: 'eventImage.png',
                content: event[0].image3.split("base64,")[1],
                encoding: 'base64',
                cid: 'eventImage'
            }
            ]
           
        };

        await transporter.sendMail(mailOptions)

    } catch (error) {
        throw error
    }
}

// Send email for ticket cancellation
export const cancelUserBookingService = async(req, res) => {
    try {
        const userID = req.userID
        const ticketID = req.params.ticketID

        const user = await userdb.getUserByIdDb(userID)
        const ticket = await ticketdb.getTicketByIdDb(ticketID)
        const event = await eventdb.getEventByIdDisplayDb(ticket.eventid)
        
        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: user.email,
            subject: 'Ticket Refund: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="cid:logo" alt="Flowers in Chania" width="460" height="345"> </center>
            <p>Dear ${user.firstname}, <br><br> Your refund request has been processed for ${event[0].eventname}.  <b> You will be refunded the full amount to the account that was used to for the ticket purchase. </b> <br> <br> Tickets will be automatically refunded in full (including refundable ticket purchase, if relevant) to the original payment method used for purchase and patrons do not need to take any action. <br> <br> Patrons should allow approximately 30 business days for the refund to appear in their account. <br><br> <br> Kind regards, <br><br> The Eventful Team <br><br><br><br><br> </p>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/logo.png',
                cid: 'logo'
            }]
           
        };

        await transporter.sendMail(mailOptions)

    } catch (error) {
        throw error
    }
}

export const unpublishEventsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const event = await eventdb.getEventByIdDb(eventID);

        // Getting guest list details to send event cancellation email
        const guests = await eventdb.getEventGuestListByIdDb(eventID)
        
        for (let guest of guests) {
            var mailOptions = {
                from: 'eventful.geegle@gmail.com',
                to: guest.email,
                subject: 'Event Cancellation: ' + event[0].eventname,
                html: 

                `<body>
                <font face = "arial">
                <p style="background-color:rgb(118, 43, 255);"><br></p>
                <center> <img  src="cid:logo" alt="Flowers in Chania" width="460" height="345"> </center>
                <p>Dear ${guest.firstname}, <br><br> We regret to inform you that ${event[0].eventname} has been cancelled. </b> <br> <br> Tickets will be automatically refunded in full (including refundable ticket purchase, if relevant) to the original payment method used for purchase and patrons do not need to take any action. <br> <br> Patrons should allow approximately 30 business days for the refund to appear in their account. <br> <br> Kind regards, <br><br> The Eventful Team <br><br><br><br><br></p>
                <center>
                <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
                </font>
                </body>
                `,
                attachments: [{
                    filename: 'logo.png',
                    path: __dirname + '/logo.png',
                    cid: 'logo'
                }]
                };

            await transporter.sendMail(mailOptions)
        }

    } catch(e) {
        throw e
    }
}

// Send email for host sending email announcement to all ticket purchasers
export const sendEventAnnouncementService = async(req, res) => {
    try {
        const eventID = req.params.eventID
        const userID = req.userID
        const { subject, announcement } = req.body;

        const user = await userdb.getUserByIdDb(userID)
        const event = await eventdb.getEventByIdDisplayDb(eventID)
        const guests = await eventdb.getEventGuestListByIdDb(eventID)
        
        for (let guest of guests) {
            var mailOptions = {
                from: 'eventful.geegle@gmail.com',
                to: guest.email,
                subject: 'Event Announcement: ' + subject,
                html: 

                `<body>
                <font face = "arial">
                <p style="background-color:rgb(118, 43, 255);"><br></p>
                <center> <img  src="cid:logo" alt="Flowers in Chania" width="460" height="345"> </center>
                <p>Dear ${guest.firstname}, <br><br> The host of ${event[0].eventname} has made the following announcement <blockquote> <i>"${announcement}"</i> </blockquote> <br><br><br><br><br></p>
                <center>
                <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
                </font>
                </body>`,
                attachments: [{
                    filename: 'logo.png',
                    path: __dirname + '/logo.png',
                    cid: 'logo'
                }]
            
            };

            await transporter.sendMail(mailOptions)
        }

    } catch (error) {
        throw error
    }
}


export const notifyReviewReplyService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const { replies } = req.body;
        
        const review = await getReviewByReviewIdDb(reviewID);

        // Get details of the customer who left the original review
        const reviewUser = await userdb.getUserByIdDb(review[0].userid)
        const replyUser = await userdb.getUserByIdDb(replies.userID)
        const event = await eventdb.getEventByIdDisplayDb(review[0].eventid)

        var mailOptions = {
            from: 'eventful.geegle@gmail.com',
            to: reviewUser.email,
            subject: 'Review replied to: ' + event[0].eventname,
            html: 

            `<body>
            <font face = "arial">
            <p style="background-color:rgb(118, 43, 255);"><br></p>
            <center> <img  src="cid:logo" alt="Flowers in Chania" width="460" height="345"> </center>
            <p>Dear ${reviewUser.firstname}, <br><br> ${replyUser.firstname} has replied to your review: <blockquote> <i>"${replies.reply}"</i> </blockquote> <br><br><br><br><br></p>
            <center>
            <p style="background-color:rgb(118, 43, 255);color:WhiteSmoke;"><br> Copyright © 2022 Eventful, All rights reserved.<br> <b>Contact us:</b><br> 02 1234 1234 <br> eventful.geegle@gmail.com <br> PO Box 123 Sydney, NSW, 2000  <br> <br> </p></center>
            </font>
            </body>`,
            attachments: [{
                filename: 'logo.png',
                path: __dirname + '/logo.png',
                cid: 'logo'
            }]
           
            };

        await transporter.sendMail(mailOptions)

    } catch (e) {
        throw e
    }
}


