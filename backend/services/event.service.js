import {addEventDb, getAllEventsNotSoldOutDb, getAllEventsDb, getEventByIdDb, getEventByIdDisplayDb,
        getEventsByHostIdDb, getEventVenueByNameDb, getEventVenueByIdDb, getEventGuestListByIdDb, getHostofEventDb, 
        isSeatedEventDb, addEventVenueDb, publishEventByIdDb, addEventTicketTypeSeatingAllocation,
        unpublishEventByIdDb, removeEventByIdDb, getEventsUserAttendingDb, isEventSoldOutDb, getSoldOutEventsDb,
        getMatchingEventsDb, getEventsByTicketPriceLimitDb, getAllEventCategoriesDb} 
        from '../db/event.db.js' 
import { getEventReviewsByEventIdDb, getReviewLikeDb, getReviewLikeAmountDb } from '../db/review.db.js'
import { getReplyAmountByReviewIDDb } from '../db/reply.db.js'
import { addTicketDb, unassignEventSeatsDb } from '../db/ticket.db.js'
import { getUserByIdDb } from '../db/user.db.js'
import { isVenueSeatingAvailableDb } from '../db/venueSeating.db.js'
import { getTicketPurchaseByUserIdDb, removeTicketPurchaseByEventIdDb } from '../db/ticketpurchase.db.js'


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
        const unpublishedEvent = await unpublishEventByIdDb(eventID)
        const guests = await getEventGuestListByIdDb(eventID)
        await removeTicketPurchaseByEventIdDb(eventID)
        await unassignEventSeatsDb(eventID)
        return {events: {
                    eventID: unpublishedEvent.eventid,
                    published: unpublishedEvent.published,
                    guests: guests
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
        if (event[0].published === true) {
            return {statusCode : 400, msg: 'Unpublish event before deleting'}
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
        const reviewRating = await eventRatingScore(event[0].eventid)
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
                    reviews: reviewRating.reviews,
                    eventRating: reviewRating.rating,
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

                const reviewRating = await eventRatingScore(eventList[i].eventid)
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
                    reviews: reviewRating.reviews,
                    eventRating: reviewRating.rating,
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
                
                const reviewRating = await eventRatingScore(eventList[i].eventid)
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
                    reviews: reviewRating.reviews,
                    eventRating: reviewRating.rating,
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
            const reviewRating = await eventRatingScore(eventList[i].eventid, req.userID)
            
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
                reviews: reviewRating.reviews,
                eventRating: reviewRating.rating,
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

        const host = await getUserByIdDb(req.params.hostID);
        if (host.length == 0) {
            return {events: null, hostRating: null, hostName: null, statusCode : 404, msg: 'Host does not exist'}
        }
        const eventsByHost = await getEventsByHostIdDb(req.params.hostID);

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
        let name = host.firstname + " " + host.lastname

        return {events: eventSummary, hostRating: runningTotalReviewRatings, hostName: name, statusCode: 200, msg: 'Details found'}

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
                const reviewRating = await eventRatingScore(eventList[i].eventid)
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
                    reviews: reviewRating.reviews,
                    eventRating: reviewRating.rating,
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
            eventList = eventList.filter(event => event.venuelocation.toLowerCase().includes(location.toLowerCase()) || 
                                                  event.venuename.toLowerCase().includes(location.toLowerCase()))
        }

        if (rating) {
            const eventRatings = {}
            for (let e of eventList) {
                eventRatings[e.eventid] = (await eventRatingScore(e.eventid)).rating
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
                const reviewRating = await eventRatingScore(eventList[i].eventid)
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
                    reviews: reviewRating.reviews,
                    eventRating: reviewRating.rating,
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

const eventRatingScore = async(eventID, userID = 0) => {
    let eventReviews = await getEventReviewsByEventIdDb(eventID);
    let score = 0.00;
    for (let i = 0; i < eventReviews.length; i++) {
        score += parseFloat(eventReviews[i].rating);

        // Format object keys
        eventReviews[i]['reviewID'] = eventReviews[i]['reviewid']
        delete eventReviews[i]['reviewid']
        eventReviews[i]['userID'] = eventReviews[i]['userid']
        delete eventReviews[i]['userid']
        const user = await getUserByIdDb(eventReviews[i]['userID'])
        eventReviews[i]['username'] = user.firstname + ' ' + user.lastname
        eventReviews[i]['eventID'] = eventReviews[i]['eventid']
        delete eventReviews[i]['eventid']
        eventReviews[i]['postedOn'] = eventReviews[i]['postedon']
        delete eventReviews[i]['postedon']
        eventReviews[i]['numLikes'] = await getReviewLikeAmountDb(eventReviews[i]['reviewID'])
        eventReviews[i]['numReplies'] = await getReplyAmountByReviewIDDb(eventReviews[i]['reviewID'])
        eventReviews[i]['userLiked'] = false
        if (userID) {
            const likedByUser = await getReviewLikeDb(eventReviews[i]['reviewID'], userID);
            eventReviews[i]['userLiked'] = (likedByUser.length === 1)
        }
    }

    if (eventReviews.length !== 0) {
        score = score/eventReviews.length;
    } 
    
    return {reviews: eventReviews, rating: score}
}

export const getAllEventCategoriesService = async() => {
    const categoriesDb = await getAllEventCategoriesDb(); 

    const categories = []
    for (let category of categoriesDb) {
        categories.push(category.eventtype)
    }

    return { categories: categories, statusCode: 200, msg: 'All event categories' }
}