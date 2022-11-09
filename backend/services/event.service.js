import e from 'express'
import {addEventDb, getAllEventsNotSoldOutDb, getAllEventsDb, getEventByIdDb, getEventByIdDisplayDb,
        getEventsByHostIdDb, getEventVenueByNameDb, getEventVenueByIdDb, getEventGuestListByIdDb, getHostofEventDb, 
        isSeatedEventDb, addEventVenueDb, publishEventByIdDb, addEventTicketTypeSeatingAllocation,
        unpublishEventByIdDb, removeEventByIdDb, getEventsUserAttendingDb, isEventSoldOutDb, getSoldOutEventsDb,
        getMatchingEventsDb, getEventsByTicketPriceLimitDb, getAllEventCategoriesDb} 
        from '../db/event.db.js' 
import { getEventReviewsByEventIdDb } from '../db/review.db.js'
import {addTicketDb} from '../db/ticket.db.js'
import { getUserByIdDb } from '../db/user.db.js'
import { isVenueSeatingAvailableDb } from '../db/venueSeating.db.js'
import { getTicketPurchaseByUserIdDb } from '../db/ticketpurchase.db.js'
import nodemailer from 'nodemailer'


/*  Request
    All fields must be filled in
    {
        events: {
            eventName: string,
            startDateTime: date,
            ...
        },
        tickets: [{ticketType: "Gold class", price: 50, ticketAmount: 20}, {...}]
    }
*/
export const createEventsService = async(req, res) => {
    try {
        const {events, tickets} = req.body

        const {eventName, startDateTime, endDateTime, 
            eventDescription, eventType, eventVenue, capacity,
            image1, image2, image3} = events
        
        if (endDateTime <= startDateTime) {
            return {events: null, statusCode : 400, msg: 'Invalid Starting and Finishing Times'}
        }
        if (capacity <= 0) {
            return {events: null, statusCode : 400, msg: 'Invalid Capacity'}
        }

        if (new Date(startDateTime) <= Date.now()) {
            return {events: null, statusCode : 400, msg: 'Invalid Event Date'}
        }

        let totalTickets = 0;
        for (let i = 0; i < tickets.length; i++) {
            totalTickets += tickets[i].ticketAmount
        }

        if (capacity < totalTickets) {
            return {events: null, statusCode : 400, msg: 'Capacity not sufficient'}
        }

        let venue = await getEventVenueByNameDb(eventVenue)
        let seatingAvailable = false
        if (venue.length === 0) {
            const { eventVenue, eventLocation, venueCapacity } = events
            venue = await addEventVenueDb(eventVenue, eventLocation, venueCapacity)
        } else {
            venue = venue[0]
            const venueSeats = await isVenueSeatingAvailableDb(venue.venueid)
            seatingAvailable = parseInt(venueSeats.count) ? true : false
        } 

        if (venue.maxcapacity < capacity) {
            return {events: null, statusCode : 400, msg: 'Venue capacity not sufficient for event'}
        }

        const newEvent = await addEventDb(eventName, req.userID, new Date(startDateTime), new Date(endDateTime), eventDescription,
                eventType, venue.venueid, capacity, totalTickets, image1, image2, image3)
    

        for (let i = 0; i < tickets.length; i++) {
            const {ticketType, price, ticketAmount, seatSections} = tickets[i]
            for (let j = 0 ; j < ticketAmount; j++) {
                const tickets = await addTicketDb(ticketType, price, newEvent.eventid)
            }  

            for (let seatSection of seatSections) {
                const allocation = await addEventTicketTypeSeatingAllocation(newEvent.eventid, ticketType, seatSection)
            }
        }

        return {events: {
                            eventID: newEvent.eventid,
                            eventName: newEvent.eventname,
                            hostID: newEvent.hostid,
                            startDateTime: newEvent.startdatetime,
                            endDateTime: newEvent.enddatetime,
                            eventDescription: newEvent.eventdescription,
                            eventType: newEvent.eventtype,
                            eventVenue: venue.venuename,
                            eventLocation: venue.venuelocation,
                            seatingAvailable: seatingAvailable,
                            capacity: newEvent.capacity,
                            totalTicketAmount: newEvent.totalticketamount,
                            image1: newEvent.image1,
                            image2: newEvent.image2,
                            image3: newEvent.image3
                        }, 
                statusCode : 201, 
                msg: 'Event Created'}

    } catch (e) {
        throw e
    }  
}

export const publishEventsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const event = await getEventByIdDb(eventID);
        if (event.length != 1) {
            return {events: null, statusCode : 404, msg: 'Event does not exist'}
        }
        if (req.userID != event[0].hostid) {
            return {events: null, statusCode : 403, msg: 'You are not the owner of this event'}
        }
        if (event[0].published) {
            return {events: null, statusCode : 400, msg: 'Event is already published'}
        }
        const publishedEvent = await publishEventByIdDb(eventID);

        return {events: {
                    eventID: publishedEvent.eventid,
                    published: publishedEvent.published
                },
                statusCode : 201, 
                msg: 'Event Published'}

    } catch(e) {
        throw e
    }
}

export const unpublishEventsService = async(req, res) => {
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

export const editEventsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        return 

    } catch(e) {
        throw e
    }
}

export const deleteEventsService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const event = await getEventByIdDb(eventID)
        if (event.length != 1) {
            return {statusCode : 404, msg: 'Event does not exist'}
        }
        if (req.userID != event[0].hostid) {
            return {statusCode : 403, msg: 'You are not the owner of this event'}
        }

        await removeEventByIdDb(eventID);
        return {statusCode : 200, msg: 'Event deleted'}

    } catch (e) {
        throw e
    }
}

export const getEventService = async(req, res) => {
    try {
        const event = await getEventByIdDisplayDb(req.params.eventID);
        if (event.length === 0) {
            return {events: null, statusCode: 404, msg: 'Event Id Not Found'}
        } 

        const seating = await isSeatedEventDb(req.params.eventID)
        
        return {event: {
                    eventID: event[0].eventid,
                    eventName: event[0].eventname,
                    hostID: event[0].hostid,
                    hostName: event[0].firstname + ' ' + event[0].lastname,
                    hostEmail: event[0].email,
                    startDateTime: event[0].startdatetime,
                    endDateTime: event[0].enddatetime,
                    eventDescription: event[0].eventdescription,
                    eventType: event[0].eventtype,
                    eventVenueId: event[0].venueid,
                    eventVenue: event[0].venuename,
                    eventLocation: event[0].venuelocation,
                    venueCapacity: event[0].maxcapacity,
                    seatedEvent: seating.length > 0 ? true : false,
                    capacity: event[0].capacity,
                    totalTicketAmount: event[0].totalticketamount,
                    image1: event[0].image1,
                    image2: event[0].image2,
                    image3: event[0].image3,
                    published: event[0].published
                    }, 
                statusCode: 200, 
                msg: 'Event found'}
    } catch (e) {
        throw e
    }
}

export const getUpcomingEventsService = async(req, res) => {
    try {
        const eventList = await getAllEventsNotSoldOutDb();
        let upcomingEventList = [];
        const upcomingEventDateCutoff = new Date().setMonth((new Date().getMonth() + 1))
        for (let i = 0; i < eventList.length; i++) {
            if (new Date(eventList[i].startdatetime) >= new Date() && 
                new Date(eventList[i].startdatetime) <= upcomingEventDateCutoff &&
                eventList[i].published) {

                upcomingEventList.push({
                    eventID: eventList[i].eventid,
                    eventName: eventList[i].eventname,
                    hostID: eventList[i].hostid,
                    hostName: eventList[i].firstname + ' ' + eventList[i].lastname,
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventVenue: eventList[i].venuename,
                    eventLocation: eventList[i].venuelocation,
                    venueCapacity: eventList[i].maxcapacity,
                    capacity: eventList[i].capacity,
                    totalTicketAmount: eventList[i].totalticketamount,
                    image1: eventList[i].image1,
                    image2: eventList[i].image2,
                    image3: eventList[i].image3
                });
            }
        }
        return {events: upcomingEventList, statusCode: 200, msg: 'Events found'}
    } catch (e) {
        throw e
    }
}

export const getAllEventsService = async(req, res) => {
    try {
        const eventList = await getAllEventsDb();
        const availableEventList = await getAllEventsNotSoldOutDb();
        let upcomingEventList = [];
        for (let i = 0; i < eventList.length; i++) {
            if (new Date(eventList[i].startdatetime) > new Date() &&
                eventList[i].published) {

                let soldOut = !availableEventList.some(event => event.eventid === eventList[i].eventid)
                if (eventList[i])
                upcomingEventList.push({
                    eventID: eventList[i].eventid,
                    eventName: eventList[i].eventname,
                    hostID: eventList[i].hostid,
                    hostName: eventList[i].firstname + ' ' + eventList[i].lastname,
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventVenue: eventList[i].venuename,
                    eventLocation: eventList[i].venuelocation,
                    venueCapacity: eventList[i].maxcapacity,
                    capacity: eventList[i].capacity,
                    totalTicketAmount: eventList[i].totalticketamount,
                    image1: eventList[i].image1,
                    image2: eventList[i].image2,
                    image3: eventList[i].image3,
                    soldOut: soldOut
                });
            }
        }
        return {events: upcomingEventList, statusCode: 200, msg: 'Events found'}
    } catch (e) {
        throw e
    }
}


export const getHostEventsService = async(req, res) => {
    try {
        const eventList = await getEventsByHostIdDb(req.userID);
        
        let upcomingEventList = [];
        for (let i = 0; i < eventList.length; i++) {
            const seating = await isSeatedEventDb(eventList[i].eventid)
            
            upcomingEventList.push({
                eventID: eventList[i].eventid,
                eventName: eventList[i].eventname,
                hostID: eventList[i].hostid,
                startDateTime: eventList[i].startdatetime,
                endDateTime: eventList[i].enddatetime,
                eventDescription: eventList[i].eventdescription,
                eventType: eventList[i].eventtype,
                eventVenue: eventList[i].venuename,
                eventLocation: eventList[i].venuelocation,
                venueCapacity: eventList[i].maxcapacity,
                seatedEvent: seating.length > 0 ? true : false,
                capacity: eventList[i].capacity,
                totalTicketAmount: eventList[i].totalticketamount,
                published: eventList[i].published,
                image1: eventList[i].image1,
                image2: eventList[i].image2,
                image3: eventList[i].image3,
            });
        }
        
        return {events: upcomingEventList, statusCode: 200, msg: 'Events found'}
    } catch (e) {
        throw e
    }
}

export const getEventsUserAttendingService = async(req, res) => {
    try {
        let eventList = await getEventsUserAttendingDb(req.userID);
        
        let events = [];
        for (let i = 0; i < eventList.length; i++) {
            const event = await getEventByIdDisplayDb(eventList[i].eventid)
            events.push({
                eventID: event[0].eventid,
                eventName: event[0].eventname,
                hostID: event[0].hostid,
                hostName: event[0].firstname + ' ' + event[0].lastname,
                hostEmail: event[0].email,
                startDateTime: event[0].startdatetime,
                endDateTime: event[0].enddatetime,
                eventDescription: event[0].eventdescription,
                eventType: event[0].eventtype,
                eventVenue: event[0].venuename,
                eventLocation: event[0].venuelocation,
                venueCapacity: event[0].maxcapacity,
                capacity: event[0].capacity,
                totalTicketAmount: event[0].totalticketamount,
                image1: event[0].image1,
                image2: event[0].image2,
                image3: event[0].image3
                });
        }
        
        return {events: events, statusCode: 200, msg: 'Events found'}
    } catch (e) {
        throw e
    }
}

export const getEventGuestListService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const host = await getHostofEventDb(eventID)
        if (req.userID != host[0].hostid) {
            return {guests: null, statusCode : 403, msg: 'You are not the owner of this event'}
        }
        
        const guests = await getEventGuestListByIdDb(eventID)
        
        let guestList = [];
        for (let guest of guests) {
            const info = {}
            info.name = guest.firstname + ' ' + guest.lastname
            info.email = guest.email
            info.tickets = []
            const tickets = await getTicketPurchaseByUserIdDb(eventID, guest.userid)
            
            for (const ticket of tickets) {
                const seating = await isSeatedEventDb(ticket.eventid)
                info.tickets.push({
                    ticketID: ticket.ticketid,
                    ticketType: ticket.tickettype,
                    price: ticket.price,
                    seat: seating.length > 0 ? 
                        {seatID: ticket.seatid, seatSection: ticket.seatsection, seatRow: ticket.seatrow, seatNo: ticket.seatno } : null
                })
            }
            guestList.push(info)
        }
        // console.log(guestList)
        return {guests: guestList, statusCode: 200, msg: 'Guest list'}
    } catch (e) {
        throw e
    }
}

export const getHostDetailsService = async(req, res) => {
    try {
        const {hostID} = req.body;

        const host = getUserByIdDb(hostID);
        if (host.length == 0) {
            return {events: null, hostRating: null, statusCode : 404, msg: 'Host does not exist'}
        }
        const eventsByHost = await getEventsByHostIdDb(hostID);

        let eventSummary = [];
        let runningTotalReviewRatings = 0.00;
        let totalReviews = 0;
        for (let i = 0; i < eventsByHost.length; i++) {
            let eventReviews = await getEventReviewsByEventIdDb(eventsByHost[i].eventid);
            let eventReviewNum = 0;
            let eventReviewScore = 0.00;
            for (let j = 0; j < eventReviews.length; j++) {
                totalReviews++;
                eventReviewNum++;
                runningTotalReviewRatings += parseFloat(eventReviews[j].rating);
                eventReviewScore += parseFloat(eventReviews[j].rating);
            }
            if (eventReviewNum != 0) {
                eventReviewScore = eventReviewScore/eventReviewNum;
            } else {
                eventReviewScore = 0;
            }
            // consider adding top few reviews ordered by likes
            eventSummary.push({
                eventID: eventsByHost[i].eventid,
                eventName: eventsByHost[i].eventname,
                startDateTime: eventsByHost[i].startdatetime,
                endDateTime: eventsByHost[i].enddatetime,
                eventVenue: eventsByHost[i].venuename,
                eventScore: eventReviewScore,
                numReviews: eventReviewNum
            });   
        }

        if (totalReviews != 0) {
            runningTotalReviewRatings = runningTotalReviewRatings / totalReviews;
        } else {
            runningTotalReviewRatings = 0;
        }
        return {events: eventSummary, hostRating: runningTotalReviewRatings, statusCode: 200, msg: 'Details found'}

    } catch (e) {
        throw e
    }
}

export const isEventSoldOutService = async(req, res) => {
    try {
        const eventID = req.params.eventID;
        const event = await isEventSoldOutDb(eventID)
        
        if (event.length === 0) {
            return { soldOut: false, statusCode: 200, msg: `Event ${eventID} still available` }
        } else {
            return { soldOut: true, statusCode: 200, msg: `Event ${eventID} sold out` }
        }

    } catch (e) {
        throw e
    }
}

export const getSoldOutEventsService = async(req, res) => {
    try {
        const eventList = await getSoldOutEventsDb()
        
        const events = []
        for (let i = 0; i < eventList.length; i++) {
            events.push({
                eventID: eventList[i].eventid,
                eventName: eventList[i].eventname,
                hostID: eventList[i].hostid,
                hostName: eventList[i].firstname + ' ' + eventList[i].lastname,
                startDateTime: eventList[i].startdatetime,
                endDateTime: eventList[i].enddatetime,
                eventDescription: eventList[i].eventdescription,
                eventType: eventList[i].eventtype,
                eventVenue: eventList[i].venuename,
                eventLocation: eventList[i].venuelocation,
                venueCapacity: eventList[i].maxcapacity,
                capacity: eventList[i].capacity,
                totalTicketAmount: eventList[i].totalticketamount,
                image1: eventList[i].image1,
                image2: eventList[i].image2,
                image3: eventList[i].image3
            })
        }
        return {events: events, statusCode: 200, msg: 'Sold out events'}

    } catch (e) {
        throw e
    }
}

export const getEventsSearchedService = async(searchWords) => {
    try {
        const eventList = await getMatchingEventsDb(searchWords)
        
        const events = []
        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].published) {
                events.push({
                    eventID: eventList[i].eventid,
                    eventName: eventList[i].eventname,
                    hostID: eventList[i].hostid,
                    hostName: eventList[i].firstname + ' ' + eventList[i].lastname,
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventVenue: eventList[i].venuename,
                    eventLocation: eventList[i].venuelocation,
                    venueCapacity: eventList[i].maxcapacity,
                    capacity: eventList[i].capacity,
                    totalTicketAmount: eventList[i].totalticketamount,
                    image1: eventList[i].image1,
                    image2: eventList[i].image2,
                    image3: eventList[i].image3
                })
            }
        }
        return {events: events, statusCode: 200, msg: 'Events matching search criteria'}

    } catch (e) {
        throw e
    }
}

export const getEventsFilteredService = async(from, to, category, location, rating, priceLimit) => {
    try {
        let eventList = await getAllEventsDb();
        if (from) {
            eventList = eventList.filter(event => new Date(event.startdatetime) >= new Date(from))
        }

        if (to) {
            eventList = eventList.filter(event => new Date(event.enddatetime) <= new Date(to))
        }
        
        if (category) {
            if (category instanceof Array) {
                eventList = eventList.filter(event => {
                    for (const cat of category) {
                        if (event.eventtype === cat)
                            return true
                    }   
                })
            } else {
                eventList = eventList.filter(event => event.eventtype === category)
            }
            
        }

        if (location) {
            eventList = eventList.filter(event => event.venuelocation.toLowerCase().includes(location.toLowerCase()))
        }

        if (rating) {
            const eventRatings = {}
            for (let e of eventList) {
                eventRatings[e.eventid] = await eventRatingScore(e.eventid)
            }

            eventList = eventList.filter(event => eventRatings[event.eventid] >= parseInt(rating))
        }

        if (priceLimit) {
            const eventsPriceLimited = await getEventsByTicketPriceLimitDb(parseInt(priceLimit))
            eventList = eventList.filter(el => eventsPriceLimited.some(epl => epl.eventid === el.eventid))
        }

        const events = []
        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].published) {
                events.push({
                    eventID: eventList[i].eventid,
                    eventName: eventList[i].eventname,
                    hostID: eventList[i].hostid,
                    hostName: eventList[i].firstname + ' ' + eventList[i].lastname,
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventVenue: eventList[i].venuename,
                    eventLocation: eventList[i].venuelocation,
                    venueCapacity: eventList[i].maxcapacity,
                    capacity: eventList[i].capacity,
                    totalTicketAmount: eventList[i].totalticketamount,
                    image1: eventList[i].image1,
                    image2: eventList[i].image2,
                    image3: eventList[i].image3
                })
            }
        }
        return {events: events, statusCode: 200, msg: 'Events matching filter criteria'}

    } catch (e) {
        throw e
    }
}

const eventRatingScore = async(eventID) => {
    let eventReviews = await getEventReviewsByEventIdDb(eventID);
    let score = 0.00;
    for (let i = 0; i < eventReviews.length; i++) {
        score += parseFloat(eventReviews[i].rating);
    }
    if (eventReviews.length !== 0) {
        score = score/eventReviews.length;
    } 
    
    return score
}

export const getAllEventCategoriesService = async() => {
    const categoriesDb = await getAllEventCategoriesDb(); 

    const categories = []
    for (let category of categoriesDb) {
        categories.push(category.eventtype)
    }

    return { categories: categories, statusCode: 200, msg: 'All event categories' }
}