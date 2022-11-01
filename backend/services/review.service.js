import { addReviewDb, editReviewByIdDb, getEventReviewsByEventIdDb, getReviewByReviewIdDb, 
    getReviewLikeAmountDb, getReviewLikeDb, deleteReviewByIdDb, addReviewLikeDb, deleteReviewLikeByIdDb } from '../db/review.db.js'
import { getUserByIdDb } from '../db/user.db.js'
import { getEventByIdDb } from '../db/event.db.js'
import { addReplyDb, editReplyByIdDb, getReplyAmountByReviewIDDb, getReplyByReplyIdDb, getReplyByReviewIdDb,
    deleteReplyByIdDb } from '../db/reply.db.js'

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
            numReplies: 0,
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
            let numReplies = await getReplyAmountByReviewIDDb(eventReviews[i].reviewid);
            reviewList.push({
                reviewID: eventReviews[i].reviewid,
                review: eventReviews[i].review,
                rating: eventReviews[i].rating,
                postedOn: eventReviews[i].postedon,
                user: username.firstname + " " + username.lastname,
                userID: eventReviews[i].userid,
                numLikes: parseInt(likes),
                numReplies: parseInt(numReplies),
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
        const likes = await getReviewLikeAmountDb(reviewID);
        const newReview = await editReviewByIdDb(reviewID, review, rating, new Date(Date.now()));
        const currentUserReviewLike = await getReviewLikeDb(reviewID, req.userID);
        const currentUserLiked = (currentUserReviewLike.length >= 1);
        const numReplies = await getReplyAmountByReviewIDDb(reviewID);
        return {reviews: {
            reviewID: newReview.reviewid,
            eventID: newReview.eventid,
            review: newReview.review,
            rating: newReview.rating,
            postedOn: newReview.postedon,
            userID: newReview.userid,
            user: user.firstname + " " + user.lastname,
            numLikes: parseInt(likes),
            numReplies: parseInt(numReplies),
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
            return {reviews: null, statusCode: 400, msg: 'Review does not exist'}
        }

        const userReviewLike = await getReviewLikeDb(reviewID, req.userID);
        if (userReviewLike.length >= 1) {
            return {reviews: null, statusCode: 400, msg: 'User has already liked this review'}
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

export const getReviewReplyService = async(req, res) => {
    try {
        const reviewID = req.params.reviewID;
        const {reply} = req.body;
        
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {replies: null, statusCode: 400, msg: 'Review does not exist'}
        }

        const replies = await getReplyByReviewIdDb(reviewID);
        let replyList = [];
        for (let i = 0; i < replies.length; i++) {
            let username = await getUserByIdDb(replies[i].userid);
            replyList.push({
                replyID: replies[i].replyid,
                reviewID: replies[i].reviewid,
                userID: replies[i].userid,
                reply: replies[i].reply,
                repliedOn: replies[i].repliedon,
                user: username.firstname + " " + username.lastname
            });
        }
        return {replies: replyList, statusCode: 200, msg: 'Replies found'}
    } catch (e) {
        throw e
    }
}

export const editReviewReplyService = async(req, res) => {
    try {    
        const reviewID = req.params.reviewID;
        const {reply} = req.body;
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {replies: null, statusCode: 400, msg: 'Review does not exist'}
        }
        const replyFromId = await getReplyByReplyIdDb(req.params.replyID);

        if (replyFromId.length == 0) {
            return {replies: null, statusCode: 403, msg: 'Reply does not exist'}
        }
        
        if (replyFromId[0].userid != req.userID) {
            return {replies: null, statusCode: 403, msg: 'You do not have permission to delete this review'}
        }

        const editReply = await editReplyByIdDb(req.params.replyID, reply, new Date(Date.now()));
        const user = await getUserByIdDb(editReply.userid)

        return {replies: {
            replyID: editReply.replyid,
            reviewID: editReply.reviewid,
            reply: editReply.reply,
            repliedOn: editReply.repliedon,
            userID: editReply.userid,
            user: user.firstname + " " + user.lastname
        },
        statusCode : 200, 
        msg: 'Reply Edited'}

    } catch (e) {
        throw e
    }
}

export const deleteReviewReplyService = async(req, res) => {
    try {    
        const reviewID = req.params.reviewID;
        const review = await getReviewByReviewIdDb(reviewID);

        if (review.length == 0) {
            return {statusCode: 400, msg: 'Review does not exist'}
        }
        const replyFromId = await getReplyByReplyIdDb(req.params.replyID);

        if (replyFromId.length == 0) {
            return {statusCode: 403, msg: 'Reply does not exist'}
        }
        
        if (replyFromId[0].userid != req.userID) {
            return {statusCode: 403, msg: 'You do not have permission to delete this review'}
        }

        await deleteReplyByIdDb(req.params.replyID);
        return {statusCode : 200, msg: 'Reply Deleted'}

    } catch (e) {
        throw e
    }
}
