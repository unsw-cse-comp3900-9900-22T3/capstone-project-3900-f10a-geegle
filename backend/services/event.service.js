import {addEventDb, getAllEventsNotSoldOutDb, getEventByIdDb, publishEventByIdDb, removeEventByIdDb} from '../db/event.db.js'
import {addTicketDb} from '../db/ticket.db.js'



export const createEventsService = async(req, res) => {
    try {
        const {events, tickets} = req.body;

        const {eventName, startDateTime, endDateTime, 
            eventLocation, eventDescription, eventVenue, capacity} = events;
        
        if (endDateTime <= startDateTime) {
            return {events: null, statusCode : 400, msg: 'Invalid Starting and Finishing Times'}
        }
        if (capacity <= 0) {
            return {events: null, statusCode : 400, msg: 'Invalid Capacity'}
        }
        if (eventDate <= Date.now()) {
            return {events: null, statusCode : 400, msg: 'Invalid Event Date'}
        }

        let totalTickets = 0;
        for (let i = 0; i < tickets.length; i++) {
            totalTickets += tickets[i].ticketAmount;
        }

        const newEvent = await addEventDb(eventName, req.userID, startDateTime, endDateTime, eventDescription,
            eventLocation, eventVenue, capacity, ticketAmount)
    

        for (let i = 0; i < tickets.length; i++) {
            const {ticketType, ticketAmount, price} = tickets[i];
            for (let j = 0 ; j < ticketAmount; j++) {
                const tickets = await addTicketDb(ticketType, price, newEvent.eventid)
            }
            
        }
        return {events: {
            eventID: newEvent.eventid,
            hostID: newEvent.hostid,
            startDateTime: newEvent.startdatetime,
            endDateTime: newEvent.enddatetime,
            eventDescription: newEvent.eventdescription,
            eventLocation: newEvent.eventlocation,
            eventVenue: newEvent.eventvenue,
            capacity: newEvent.capacity
        }, statusCode : 201, msg: 'Event Created'}

    } catch (e) {
        throw e
    }  
}

export const publishEventsService = async(req, res) => {
    try {
        const {eventID} = req.params.eventID;
        const event = await getEventByIdDb(eventID);
        if (event.length != 1) {
            return {events: null, statusCode : 404, msg: 'Event does not exist'}
        }
        if (event[0].published) {
            return {events: null, statusCode : 400, msg: 'Event is already published'}
        }
        if (req.userID != event[0].hostid) {
            return {events: null, statusCode : 403, msg: 'You are not the owner of this event'}
        }
        const publishedEvent = await publishEventByIdDb(eventID);

        return {events: {
            eventID: publishedEvent.eventid,
            hostID: publishedEvent.hostid,
            startDateTime: publishedEvent.startdatetime,
            endDateTime: publishedEvent.enddatetime,
            eventDescription: publishedEvent.eventdescription,
            eventLocation: publishedEvent.eventlocation,
            eventVenue: publishedEvent.eventvenue,
            capacity: publishedEvent.capacity
        }, statusCode : 201, msg: 'Event Created'}

    } catch(e) {
        throw e
    }
}

export const cancelEventsService = async(req, res) => {
    try {
        const {eventID} = req.params.eventID;
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
        const upcomingEventDateCutoff = new Date(now.setMonth(now.getMonth() + 1))
        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].startdatetime > new Date(now) && 
            eventList[i].startdatetime < upcomingEventDateCutoff) {
                upcomingEventList.push({
                    eventID: eventList[i].eventid,
                    hostID: eventList[i].hostid,
                    eventDate: eventList[i].eventdate,
                    startTime: eventList[i].starttime,
                    endTime: eventList[i].endtime,
                    eventDescription: eventList[i].eventdescription,
                    eventLocation: eventList[i].eventlocation,
                    eventVenue: eventList[i].eventvenue,
                    capacity: eventList[i].capacity
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
        let upcomingEventList = [];
        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i].startdatetime > new Date(now)) {
                upcomingEventList.push({
                    eventID: eventList[i].eventid,
                    hostID: eventList[i].hostid,
                    eventDate: eventList[i].eventdate,
                    startTime: eventList[i].starttime,
                    endTime: eventList[i].endtime,
                    eventDescription: eventList[i].eventdescription,
                    eventLocation: eventList[i].eventlocation,
                    eventVenue: eventList[i].eventvenue,
                    capacity: eventList[i].capacity
                });
            }
        }
        return {events: upcomingEventList, statusCode: 200, msg: 'Events found'}
    } catch (e) {
        throw e
    }
}


