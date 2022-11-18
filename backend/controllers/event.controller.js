import { createEventsService, publishEventsService, unpublishEventsService, editEventsService, deleteEventsService, 
         getEventService, getUpcomingEventsService, getAllEventsService, getHostEventsService, getHostDetailsService, 
         getEventsUserAttendingService, getEventGuestListService, isEventSoldOutService, getSoldOutEventsService,
         getEventsSearchedService, getEventsFilteredService, getAllEventCategoriesService, getRecommendedEventsForUserService, getEventDataService, getEventTodoService, addEventTodoService, updateEventTodoService, deleteEventTodoService } 
         from "../services/event.service.js";

import { getEventReviewsService, createEventReviewService, editEventReviewService, 
    deleteEventReviewService, addLikeToEventReviewService, removeLikeToEventReviewService,
    createReviewReplyService, getReviewReplyService, editReviewReplyService, deleteReviewReplyService,
    checkUserHasLeftReviewService } from "../services/review.service.js"

// Controller layer for creating events
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

// Controller layer for publishing events
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

// Controller layer for unpublishing events 
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

// Controller layer for deleting events
export const deleteEventsController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteEventsService(req, res);  
        res.status(statusCode).json(msg)

    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for getting all events
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

// Controller layer for getting upcoming events 
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

// Controller layer for getting all events
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

// Controller layer for getting all events from a specific host
export const getHostEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getHostEventsService(req, res);
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for getting details and average rating of a host
export const getHostDetailsController = async(req, res) => {
    try {
        const {events, hostRating, hostName, hostEmail, statusCode, msg} = await getHostDetailsService(req, res);
        if (!events) {
            res.status(statusCode).json({hostName, msg})
        } else {
            res.status(statusCode).json({events, hostRating, hostName, hostEmail, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for getting all events a user is attending
export const getEventsUserAttendingController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getEventsUserAttendingService(req, res);
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for creating a review for an event
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

// Controller layer for getting all review for an event
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

// Controller layer for getting all reviews when user is logged in
export const getEventReviewsUserController = async(req, res) => {
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

// Controller layer for editing a review that you wrote
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

// Controller layer for deleting a review that you wrote
export const deleteEventReviewController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteEventReviewService(req, res);
        res.status(statusCode).json({msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for checking whether a user has left a review
export const checkUserLeftReviewController = async(req, res) => {
    try {
        const {reviews, statusCode, msg} = await checkUserHasLeftReviewService(req, res);
        if (!reviews) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({reviews, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for replying to a review
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

// Controller layer for getting all replies to a review
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

// Controller layer for editing a reply that you wrote
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

// Controller layer for deleting a reply that you wrote
export const deleteEventReviewReplyController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteReviewReplyService(req, res);
        res.status(statusCode).json({msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer for adding a like to a review
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

// Controller layer for removing a like to a review
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

// Controller layer to get guest list for an event
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

// Controller layer to determine if an event is sold out
export const isEventSoldOutController = async(req, res) => {
    try {
        const {soldOut, statusCode, msg} = await isEventSoldOutService(req, res);     
        res.status(statusCode).json({soldOut, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get events that are sold out
export const getSoldOutEventsController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getSoldOutEventsService(req, res);     
        res.status(statusCode).json({events, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get events that match a specific criteria
export const getMatchingEventsController = async(req, res) => {
    try {
        const { searchWords, from, to, category, location, rating, priceLimit } = req.query
        let userID = req.userID
        if (!userID) userID = 0
        
        let events, statusCode, msg
        if (searchWords) {
            ({events, statusCode, msg} = await getEventsSearchedService(searchWords, userID))
        }  else {
            ({events, statusCode, msg} = await getEventsFilteredService(from, to, category, location, rating, priceLimit, userID))
        }
        
        res.status(statusCode).json({events, msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get all event categories
export const getAllEventCategoriesController = async(req, res) => {
    try {
        const {categories, statusCode, msg} = await getAllEventCategoriesService(req, res);     
        res.status(statusCode).json({categories, msg})
        
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get events recommended for the user
export const getRecommendedEventsForUserController = async(req, res) => {
    try {
        const {events, statusCode, msg} = await getRecommendedEventsForUserService(req, res);
        if (!events) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({events, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get event metrics for the dashboard
export const getEventDataController = async(req, res) => {
    try {
        const {stats, statusCode, msg} = await getEventDataService(req, res);
        if (!stats) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({stats, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to get the to-do list for an event
export const getEventTodoController = async(req, res) => {
    try {
        const {todo, statusCode, msg} = await getEventTodoService(req, res);
        res.status(statusCode).json({todo, msg})
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to add an event on the to-do list
export const addEventTodoController = async(req, res) => {
    try {
        const {todo, statusCode, msg} = await addEventTodoService(req, res);
        if (!todo) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({todo, msg})
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to update an event on the to-do list
export const updateEventTodoController = async(req, res) => {
    try {
        const {todo, statusCode, msg} = await updateEventTodoService(req, res);
        if (!todo) {
            res.status(statusCode).json(msg)
        } else {
            res.status(statusCode).json({todo, msg})
        }

    } catch (e) {
        res.status(500).send(e.message)
    }
}

// Controller layer to delete an event on the to-do list
export const deleteEventTodoController = async(req, res) => {
    try {
        const {statusCode, msg} = await deleteEventTodoService(req, res);
        res.status(statusCode).json(msg)

    } catch (e) {
        res.status(500).send(e.message)
    }
}
