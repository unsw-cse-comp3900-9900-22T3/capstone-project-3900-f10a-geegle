import { addReviewDb, editReviewByIdDb, getEventReviewsByEventIdDb, getReviewByReviewIdDb, 
    getReviewLikeAmountDb, getReviewLikeDb, deleteReviewByIdDb, addReviewLikeDb, deleteReviewLikeByIdDb } from '../db/review.db.js'
import { getUserByIdDb } from '../db/user.db.js'
import { getEventByIdDb } from '../db/event.db.js'

export const createEventReviewService = async(req, res) => {
    try {    
        const {review, rating} = req.body

        if (rating < 0 || rating > 5) {
            return {reviews: null, statusCode: 400, msg: 'Invalid Rating'}
        }
        
        const events = await getEventByIdDb(req.params.eventID);
        if (events.length == 0) {
            return {reviews: null, statusCode: 400, msg: 'Event does not exist'}
        }

        if (review == '') {
            return {reviews: null, statusCode: 400, msg: 'Review contains no content'}
        }

        const timestamp = new Date(Date.now());
        const newReview = await addReviewDb(req.params.eventID, req.userID, rating, review, timestamp);
        // assume the user that just created the review is valid (token validated)
        const user = await getUserByIdDb(newReview.userid);

        return {reviews: {
            reviewID: newReview.reviewid,
            eventID: newReview.eventid,
            review: newReview.review,
            rating: newReview.rating,
            postedOn: newReview.postedon,
            userID: newReview.userid,
            user: user.firstname + " " + user.lastname,
            numLikes: 0,
            userLiked: false
        },
        statusCode : 201, 
        msg: 'Review Published'}
    } catch(e) {
        throw e
    }
}

export const getEventReviewsService = async(req, res) => {
    try {
        const eventReviews = await getEventReviewsByEventIdDb(req.params.eventID);

        const events = await getEventByIdDb(req.params.eventID);
        if (events.length == 0) {
            return {reviews: null, statusCode: 400, msg: 'Event does not exist'}
        }

        let reviewList = [];
        for (let i = 0; i < eventReviews.length; i++) {
            let username = await getUserByIdDb(eventReviews[i].userid);
            let likes = await getReviewLikeAmountDb(eventReviews[i].reviewid);
            let currentUserReviewLike = await getReviewLikeDb(eventReviews.reviewid, req.userID);
            let currentUserLiked = (currentUserReviewLike.length >= 1);
            reviewList.push({
                reviewID: eventReviews[i].reviewid,
                review: eventReviews[i].review,
                rating: eventReviews[i].rating,
                postedOn: eventReviews[i].postedon,
                user: username.firstname + " " + username.lastname,
                userID: eventReviews[i].userid,
                numLikes: parseInt(likes),
                userLiked: currentUserLiked
            });
        }
        return {reviews: reviewList, statusCode: 200, msg: 'Reviews found'}
    } catch(e) {
        throw e
    }
}

export const editEventReviewService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const {review, rating} = req.body;
        const reviewFromId = await getReviewByReviewIdDb(reviewID);

        if (reviewFromId.length == 0) {
            return {reviews: null, statusCode: 400, msg: 'Review does not exist'}
        }

        if (reviewFromId[0].userid != req.userID) {
            return {reviews: null, statusCode: 403, msg: 'You do not have permission to edit this review'}
        }
        const user = await getUserByIdDb(req.userID);
        let likes = await getReviewLikeAmountDb(reviewID);
        const newReview = await editReviewByIdDb(reviewID, review, rating, new Date(Date.now()));
        const currentUserReviewLike = await getReviewLikeDb(reviewID, req.userID);
        const currentUserLiked = (currentUserReviewLike.length >= 1);
        return {reviews: {
            reviewID: newReview.reviewid,
            eventID: newReview.eventid,
            review: newReview.review,
            rating: newReview.rating,
            postedOn: newReview.postedon,
            userID: newReview.userid,
            user: user.firstname + " " + user.lastname,
            numLikes: parseInt(likes),
            userLiked: currentUserLiked
        },
        statusCode : 200, 
        msg: 'Review Updated'}

    } catch (e) {
        throw e
    }
}

export const deleteEventReviewService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {statusCode: 400, msg: 'Review does not exist'}
        }
        if (review[0].userid != req.userID) {
            return {statusCode: 403, msg: 'You do not have permission to delete this review'}
        }
        await deleteReviewByIdDb(reviewID);
        return {statusCode : 200, msg: 'Review Deleted'}

    } catch (e) {
        throw e
    }
}


export const addLikeToEventReviewService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {statusCode: 400, msg: 'Review does not exist'}
        }

        const userReviewLike = await getReviewLikeDb(reviewID, req.userID);
        if (userReviewLike.length >= 1) {
            return {statusCode: 400, msg: 'User has already liked this review'}
        }

        const newLike = await addReviewLikeDb(reviewID, req.userID);
        let likes = await getReviewLikeAmountDb(reviewID);
        return {reviews : {
            reviewID: reviewID,
            numLikes: parseInt(likes),
            userID: review.userid,
            userLiked: true
        },
        statusCode : 200, 
        msg: 'Review Liked'}

    } catch(e) {
        throw e
    }
}

export const removeLikeToEventReviewService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {statusCode: 400, msg: 'Review does not exist'}
        }

        const userReviewLike = await getReviewLikeDb(reviewID, req.userID);
        if (userReviewLike.length == 0) {
            return {statusCode: 400, msg: 'User has not liked this review yet'}
        }

        const removeLike = await deleteReviewLikeByIdDb(reviewID, req.userID);
        let likes = await getReviewLikeAmountDb(reviewID);
        return {reviews : {
            reviewID: reviewID,
            numLikes: parseInt(likes),
            userID: review.userid,
            userLiked: false
        },
        statusCode : 200, 
        msg: 'Review Unliked'}

    } catch(e) {
        throw e
    }
}


export const createReviewReplyService = async(req, res) => {

}

export const getReviewReplyService = async(req, res) => {}