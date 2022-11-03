import { createEventsService, publishEventsService, unpublishEventsService, editEventsService, deleteEventsService, 
         getEventService, getUpcomingEventsService, getAllEventsService, getHostEventsService, getHostDetailsService, 
         getEventsUserAttendingService, getEventGuestListService, isEventSoldOutService, getSoldOutEventsService,
         getEventsSearchedService, getEventsFilteredService } 
         from "../services/event.service.js";

import { getEventReviewsService, createEventReviewService, editEventReviewService, 
    deleteEventReviewService, addLikeToEventReviewService, removeLikeToEventReviewService,
    createReviewReplyService, getReviewReplyService, editReviewReplyService, deleteReviewReplyService } from "../services/review.service.js"

export const createEventsController = async(req, res) => {
    try {
        const {events,statusCode, msg} = await createEventsService(req, res);

        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }

    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const publishEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await publishEventsService(req, res);

        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const unpublishEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await unpublishEventsService(req, res);

        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const editEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await editEventsService(req, res);

        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const deleteEventsController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteEventsService(req, res);  
        res.status(statusCode).json(msg)

    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getEventController = async(req, res) => {
    try {
        const {event, statusCode, msg} = await getEventService(req, res);
        if (!event) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({event, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getUpcomingEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getUpcomingEventsService(req, res);
        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getAllEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getAllEventsService(req, res);
        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getHostEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getHostEventsService(req, res);
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getHostDetailsController = async(req, res) => {
    try {
        const {events, hostRating, statusCode, msg} = await getHostDetailsService(req, res);
        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, hostRating, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getEventsUserAttendingController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getEventsUserAttendingService(req, res);
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const createEventReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await createEventReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getEventReviewsController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await getEventReviewsService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const editEventReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await editEventReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const deleteEventReviewController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteEventReviewService(req, res);
        res.status(statusCode).json({msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const createEventReviewReplyController = async(req, res) => {
    try {
        const {replies, statusCode, msg} = await createReviewReplyService(req, res);
        if (!replies) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({replies, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getEventReviewReplyController = async(req, res) => {
    try {
        const {replies, statusCode, msg} = await getReviewReplyService(req, res);
        if (!replies) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({replies, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const editEventReviewReplyController = async(req, res) => {
    try {
        const {replies, statusCode, msg} = await editReviewReplyService(req, res);
        if (!replies) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({replies, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const deleteEventReviewReplyController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteReviewReplyService(req, res);
        res.status(statusCode).json({msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const addLikeToEventReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await addLikeToEventReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const removeLikeToEventReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await removeLikeToEventReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getEventGuestListController = async(req, res) => {
    try {
        const {guests, statusCode, msg} = await getEventGuestListService(req, res);     

        if (!guests) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({guests, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const isEventSoldOutController = async(req, res) => {
    try {
        const {soldOut, statusCode, msg} = await isEventSoldOutService(req, res);     
        res.status(statusCode).json({soldOut, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getSoldOutEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getSoldOutEventsService(req, res);     
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

export const getMatchingEventsController = async(req, res) => {
    try {
        const { searchWords, from, to, category, location, rating, priceStart, priceEnd } = req.query
        let events, statusCode, msg
        if (searchWords) {
            ({events, statusCode, msg} = await getEventsSearchedService(searchWords))
        }  else {
            ({events, statusCode, msg} = await getEventsFilteredService(from, to, category, location, rating, priceStart, priceEnd))
        }
        
        res.status(statusCode).json({events, msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}


// const getUpcomingEventsController = (req, res) => {
//     const upcomingEvents = {
//         events: [
//             {
//                 eventID: 1,
//                 eventName: "CSE BBQ",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 12),
//                 endTime: new Date(2022, 10, 13, 14),
//                 eventDescription: "Eat CSE BBQ at UNSW",
//                 eventLocation: "UNSW Library Lawn",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 2,
//                 eventName: "CSE BALL",
//                 eventDate: new Date(2022, 10, 18),
//                 startTime: new Date(2022, 10, 18, 18, 30),
//                 endTime: new Date(2022, 10, 19),
//                 eventDescription: "Dance at UNSW CSE Ball",
//                 eventLocation: "Sydney Ballroom",
//                 capacity: 300,
//                 published: true
//             },
//             {
//                 eventID: 3,
//                 eventName: "CSE Careers Expo",
//                 eventDate: new Date(2022, 10, 20),
//                 startTime: new Date(2022, 10, 20, 10),
//                 endTime: new Date(2022, 10, 20, 16),
//                 eventDescription: "Meet potential employers",
//                 eventLocation: "UNSW Sir John Clancy Auditorium",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 4,
//                 eventName: "WAO Fridays",
//                 eventDate: new Date(2022, 10, 28),
//                 startTime: new Date(2022, 10, 28, 20),
//                 endTime: new Date(2022, 10, 29, 4),
//                 eventDescription: "Party at WAO",
//                 eventLocation: "Ivy Sydney",
//                 capacity: 1000,
//                 published: true
//             },
//             {
//                 eventID: 5,
//                 eventName: "Moulin Rogue",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 18),
//                 endTime: new Date(2022, 10, 31, 21, 30),
//                 eventDescription: "Come see the musical Moulin Rogue",
//                 eventLocation: "Sydney Lyric Theatre",
//                 capacity: 700,
//                 published: true
//             },
//             {
//                 eventID: 6,
//                 eventName: "Vivid Sydney",
//                 eventDate: new Date(2022, 11, 1),
//                 startTime: new Date(2022, 11, 1, 19),
//                 endTime: new Date(2022, 11, 13, 23, 30),
//                 eventDescription: "See lights at night around Sydney",
//                 eventLocation: "Sydney CBD",
//                 capacity: 10000,
//                 published: true
//             }
//         ]
//     }
//     res.status(200).json(upcomingEvents)
// }

// const getAllEventsController = (req, res) => {
//     const allEvents = {
//         events: [
//             {
//                 eventID: 1,
//                 eventName: "CSE BBQ",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 12),
//                 endTime: new Date(2022, 10, 13, 14),
//                 eventDescription: "Eat CSE BBQ at UNSW",
//                 eventLocation: "UNSW Library Lawn",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 2,
//                 eventName: "CSE BALL",
//                 eventDate: new Date(2022, 10, 18),
//                 startTime: new Date(2022, 10, 18, 18, 30),
//                 endTime: new Date(2022, 10, 19),
//                 eventDescription: "Dance at UNSW CSE Ball",
//                 eventLocation: "Sydney Ballroom",
//                 capacity: 300,
//                 published: true
//             },
//             {
//                 eventID: 3,
//                 eventName: "CSE Careers Expo",
//                 eventDate: new Date(2022, 10, 20),
//                 startTime: new Date(2022, 10, 20, 10),
//                 endTime: new Date(2022, 10, 20, 16),
//                 eventDescription: "Meet potential employers",
//                 eventLocation: "UNSW Sir John Clancy Auditorium",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 4,
//                 eventName: "WAO Fridays",
//                 eventDate: new Date(2022, 10, 28),
//                 startTime: new Date(2022, 10, 28, 20),
//                 endTime: new Date(2022, 10, 29, 4),
//                 eventDescription: "Party at WAO",
//                 eventLocation: "Ivy Sydney",
//                 capacity: 1000,
//                 published: true
//             },
//             {
//                 eventID: 5,
//                 eventName: "Moulin Rogue",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 18),
//                 endTime: new Date(2022, 10, 31, 21, 30),
//                 eventDescription: "Come see the musical Moulin Rogue",
//                 eventLocation: "Sydney Lyric Theatre",
//                 capacity: 700,
//                 published: true
//             },
//             {
//                 eventID: 6,
//                 eventName: "Vivid Sydney",
//                 eventDate: new Date(2022, 11, 1),
//                 startTime: new Date(2022, 11, 1, 19),
//                 endTime: new Date(2022, 11, 13, 23, 30),
//                 eventDescription: "See lights at night around Sydney",
//                 eventLocation: "Sydney CBD",
//                 capacity: 10000,
//                 published: true
//             },
//             {
//                 eventID: 7,
//                 eventName: "CSE BBQ",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 12),
//                 endTime: new Date(2022, 10, 13, 14),
//                 eventDescription: "Eat CSE BBQ at UNSW",
//                 eventLocation: "UNSW Library Lawn",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 8,
//                 eventName: "CSE BALL",
//                 eventDate: new Date(2022, 10, 18),
//                 startTime: new Date(2022, 10, 18, 18, 30),
//                 endTime: new Date(2022, 10, 19),
//                 eventDescription: "Dance at UNSW CSE Ball",
//                 eventLocation: "Sydney Ballroom",
//                 capacity: 300,
//                 published: true
//             },
//             {
//                 eventID: 9,
//                 eventName: "CSE Careers Expo",
//                 eventDate: new Date(2022, 10, 20),
//                 startTime: new Date(2022, 10, 20, 10),
//                 endTime: new Date(2022, 10, 20, 16),
//                 eventDescription: "Meet potential employers",
//                 eventLocation: "UNSW Sir John Clancy Auditorium",
//                 capacity: 500,
//                 published: true
//             },
//             {
//                 eventID: 10,
//                 eventName: "WAO Fridays",
//                 eventDate: new Date(2022, 10, 28),
//                 startTime: new Date(2022, 10, 28, 20),
//                 endTime: new Date(2022, 10, 29, 4),
//                 eventDescription: "Party at WAO",
//                 eventLocation: "Ivy Sydney",
//                 capacity: 1000,
//                 published: true
//             },
//             {
//                 eventID: 11,
//                 eventName: "Moulin Rogue",
//                 eventDate: new Date(2022, 10, 13),
//                 startTime: new Date(2022, 10, 13, 18),
//                 endTime: new Date(2022, 10, 31, 21, 30),
//                 eventDescription: "Come see the musical Moulin Rogue",
//                 eventLocation: "Sydney Lyric Theatre",
//                 capacity: 700,
//                 published: true
//             },
//             {
//                 eventID: 12,
//                 eventName: "Vivid Sydney",
//                 eventDate: new Date(2022, 11, 1),
//                 startTime: new Date(2022, 11, 1, 19),
//                 endTime: new Date(2022, 11, 13, 23, 30),
//                 eventDescription: "See lights at night around Sydney",
//                 eventLocation: "Sydney CBD",
//                 capacity: 10000,
//                 published: true
//             }
//         ]
//     }
//     res.status(200).json(allEvents)
// }