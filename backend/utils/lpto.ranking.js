import { getEventsByHostIdDb } from "../db/event.db.js";
import { getEventReviewsByEventIdDb } from "../db/review.db.js";
import { getAvailableTicketsByEventIdDb } from "../db/ticket.db.js";


export async function getAllLPTORankings(events, user) {
    for (let i = 0; i < events.length; i++) {
        let lptoVal = await getSingleEventLPTO(events[i]);
        events[i]['LPTO'] =  (events[i]['LPTO'] || 0) + lptoVal;
    }
    return events;
}

async function getSingleEventLPTO(event, user) {
    
    // feasibility score f_ei (0 to 1)
    let eventStart = new Date(event.startdatetime);
    let currTime = new Date();
    let timeDiff = (currTime - eventStart)/36e5;
    
    let f = feiValue(timeDiff);
    // popularity score p_ei (1 to 5)
    let p = peiValue(event);
    // quality score q_ei (0 - 6)
    let q = qeiValue(event);
    // a score (1 - 18)
    let a = aValue();
    // b score (1 - 11)
    let b = bValue(timeDiff);
    // multipliers
    const alpha = 1;
    const beta = 2;
    const gamma = 1;
    const delta = 5;

    return f * (p**alpha) * (q**beta) * (a**gamma) * (b**delta);

}

// Determines a f_ei value based on the feasibility for the user to attend
// the event (start time etc)
function feiValue(timeDiff) {
    let day_percent = 0;
    if (timeDiff < 0) {
        day_percent = 0;
    } else if (timeDiff > 24) {
        day_percent = 1;
    } else {
        day_percent = timeDiff/24;
    }
    // assume high a to make events about to start highly undesirable
    const a = 100;
    // scaling timescale from startime to a day later
    return (a**day_percent - 1)/(a - 1);
}

// Determines a p_ei value based on the popularity (capacity) of the event
async function peiValue(event) {
    const tot_tickets = event.totalticketamount;
    const tickets_left = await getAvailableTicketsByEventIdDb(event.eventid);
    let capacity = (tot_tickets - tickets_left) / tot_tickets;
    if (capacity >= 0.0001) {
        return log(max_capacity) + 5;
    } else {
        return 1;
    }
}

// Determines a q_ei value based on the quality of the event (host reviews etc.)
async function qeiValue(event) {
    let host_events = await getEventsByHostIdDb(event.hostid);
    let num_reviews = 0;
    let total_score = 0.00;

    for (let i = 0; i < host_events.length; i++) {
        event_reviews = await getEventReviewsByEventIdDb(host_events[i].eventid);
        for (let j = 0; j < event_reviews.length; j++) {
            num_reviews++
            total_score += parseFloat(event_reviews[j].rating);
        }
    }
    // rating of 2 assigned if no events from host
    if (num_reviews == 0) {
        return 2;
    } else {
        // set reviews affecting q fully at 20
        const review_threshold = 20;
        let review_percent = 1;
        if (num_reviews < review_threshold) {
            review_percent = num_reviews/review_threshold;
        }
        let review_weighting = (1.5**review_percent - 1)/0.5;
        
        let average_rating = total_score / num_reviews;
        let modulated_rating = (((average_rating * 6/5) - 3) * review_weighting) + 3;
        return modulated_rating
    }
}


// Determines an a value based on distance to event (not implemented)
// Assume all are average (9 < d < 10km)
function aValue() {
    return 9;
}

// Determines a b values based on time difference between
// the current time and the start time of the event
function bValue(timeDiff) {
    let day_diff = timeDiff % 24;
    if (day_diff <= 0) {
        return 0;
    } else if (day_diff < 1) {
        return 11;
    } else if (day_diff < 2) {
        return 10;
    } else if (day_diff < 3) {
        return 9;
    } else if (day_diff < 4) {
        return 8;
    } else if (day_diff < 5) {
        return 7;
    } else if (day_diff < 6) {
        return 6;
    } else if (day_diff < 7) {
        return 5;
    } else if (day_diff < 14) {
        return 4;
    } else if (day_diff < 21) {
        return 3;
    } else if (day_diff < 28) {
        return 2;
    } else {
        return 1;
    }
}