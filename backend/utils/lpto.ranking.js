import { getEventsByHostIdDb } from "../db/event.db.js";
import { getEventReviewsByEventIdDb } from "../db/review.db.js";
import { getAvailableTicketsByEventIdDb } from "../db/ticket.db.js";





function getSingleEventLPTO(event, user) {
    
    // feasibility score f_ei (0 to 1)
    let eventStart = new Date(event.startdatetime);
    let currTime = new Date();
    let timeDiff = (currTime - eventStart)/36e5;
    
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
    const f_ei = (a**day_percent - 1)/(a - 1);

    // popularity score p_ei (1 to 5)
    const max_capacity = event.capacity;
    const tickets_left = await getAvailableTicketsByEventIdDb(event.eventid);
    let p_ei = 0;
    let capacity = (max_capacity - tickets_left) / max_capacity;
    if (capacity >= 0.0001) {
        p_ei = log(max_capacity) + 5;
    } else {
        p_ei = 1;
    }

    // quality score q_ei (0 - 6)
    host_events = await getEventsByHostIdDb(event.hostid);
    let q_ei = 0;
    // rating of 2 assigned if no events from host
    if (host_events.length == 0) {
        q_ei = 2;
    }
    let num_reviews = 0;
    let total_score = 0;

    for (let i = 0; i < host_events.length; i++) {
        event_reviews = await getEventReviewsByEventIdDb(host_events[i].eventid);
        for (let j = 0; j < event_reviews.length; j++) {
            num_reviews++
            total_score += event_reviews[j].rating;
        }
    }
    if (num_reviews == 0) {
        q_ei = 2;
    } else {
        // needs a logarithmic scaling factor to reduce errors with low
        // review sample size
    }

    // a score (ignored)

    // b score

    // multipliers
    const alpha = 1;
    const beta = 2;
    const gamma = 1;
    const delta = 5;

}