import {addEventDb, getAllEventsNotSoldOutDb, getAllEventsDb, getEventByIdDb,
        getEventsByHostIdDb, publishEventByIdDb, removeEventByIdDb} from '../db/event.db.js'
import {addTicketDb} from '../db/ticket.db.js'

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
            eventLocation, eventDescription, eventType, eventVenue, capacity,
            image1, image2, image3} = events
        
        if (endDateTime <= startDateTime) {
            return {events: null, statusCode : 400, msg: 'Invalid Starting and Finishing Times'}
        }
        if (capacity <= 0) {
            return {events: null, statusCode : 400, msg: 'Invalid Capacity'}
        }

        // Date comparison not working
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

        const newEvent = await addEventDb(eventName, req.userID, new Date(startDateTime), new Date(endDateTime), eventDescription,
                eventType, eventLocation, eventVenue, capacity, totalTickets, image1, image2, image3)
    

        for (let i = 0; i < tickets.length; i++) {
            const {ticketType, price, ticketAmount} = tickets[i]
            for (let j = 0 ; j < ticketAmount; j++) {
                const tickets = await addTicketDb(ticketType, price, newEvent.eventid)
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
                            eventLocation: newEvent.eventlocation,
                            eventVenue: newEvent.eventvenue,
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
                    eventName: publishedEvent.eventname,
                    hostID: publishedEvent.hostid,
                    startDateTime: publishedEvent.startdatetime,
                    endDateTime: publishedEvent.enddatetime,
                    eventDescription: publishedEvent.eventdescription,
                    eventType: publishedEvent.eventtype,
                    eventLocation: publishedEvent.eventlocation,
                    eventVenue: publishedEvent.eventvenue,
                    capacity: publishedEvent.capacity,
                    totalTicketAmount: publishedEvent.totalticketamount,
                    published: publishedEvent.published
                },
                statusCode : 201, 
                msg: 'Event Published'}

    } catch(e) {
        throw e
    }
}

export const cancelEventsService = async(req, res) => {
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
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventLocation: eventList[i].eventlocation,
                    eventVenue: eventList[i].eventvenue,
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
                    startDateTime: eventList[i].startdatetime,
                    endDateTime: eventList[i].enddatetime,
                    eventDescription: eventList[i].eventdescription,
                    eventType: eventList[i].eventtype,
                    eventLocation: eventList[i].eventlocation,
                    eventVenue: eventList[i].eventvenue,
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
            upcomingEventList.push({
                eventID: eventList[i].eventid,
                eventName: eventList[i].eventname,
                hostID: eventList[i].hostid,
                startDateTime: eventList[i].startdatetime,
                endDateTime: eventList[i].enddatetime,
                eventDescription: eventList[i].eventdescription,
                eventType: eventList[i].eventtype,
                eventLocation: eventList[i].eventlocation,
                eventVenue: eventList[i].eventvenue,
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