import { getAllEventsDb } from "../db/event.db.js";
import { addEventSimilarityById } from "../db/similarity.db.js";

export async function testAlgo() {
    // aim to move events out of this
    const events = await getAllEventsDb();
    updateAllEventSimilarity(events);
}

export async function updateAllEventSimilarity(events) {
    let event_keywords = extractKeywordsFromEvents(events);
    console.log(event_keywords);
    // Insert all words into hashmap so no duplicates
    // Counts total occurence of each word across all text
    let all_word_occ = {}
    for (let i = 0; i < event_keywords.length; i++) {
        for (let j = 0; j < event_keywords[i].length; j++) {
            all_word_occ[event_keywords[i][j]] = (all_word_occ[event_keywords[i][j]] || 0) + 1;
        }
    }
    console.log("Total word frequency: ");
    console.log(all_word_occ)

    // Create a map for each event against total occurences
    let word_freq_by_doc = populateWordMap(all_word_occ);
    let word_freq_by_event = [];
    for (let i = 0; i < event_keywords.length; i++) {
        let event_word_freq = populateWordMap(all_word_occ);
        for (let j = 0; j < event_keywords[i].length; j++) {
            event_word_freq[event_keywords[i][j]] = (event_word_freq[event_keywords[i][j]] || 0) + 1;
        }
        incrimentDocMapFromEventMap(word_freq_by_doc, event_word_freq);
        word_freq_by_event.push(event_word_freq);
    }
    console.log("Total document frequency:")
    console.log(word_freq_by_doc)
    console.log("Total frequency by event:")
    console.log(word_freq_by_event)

    // Calculate Individual TF-IDF of all event words
    let tfidf_vals = [];
    for (let i = 0; i < word_freq_by_event.length; i++) {
        let tfidf_map = populateWordMap(all_word_occ);
        let tfidf_arr = []
        for (let word in word_freq_by_event[i]) {
            // Augmented frequency to prevent bias towards longer documents - removed due reduced matching
            // let tf = (0.5 + 0.5*(word_freq_by_event[i][word]/event_keywords[i].length));
            let tf = (word_freq_by_event[i][word]/event_keywords[i].length);
            // Smoothing on idf values applied - 1 added to denominator and idf val
            let idf = Math.log(events.length/(word_freq_by_doc[word]+ 1)) + 1;
            // let idf = Math.log(events.length/word_freq_by_doc[word]);
            tfidf_map[word] = tf * idf;
            tfidf_arr.push(tfidf_map[word].toFixed(4));
        }
        tfidf_vals.push(tfidf_arr);
    }
    console.log(tfidf_vals);
    
    // Determine cosine similarity between TF-IDF vectorised inputs
    for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
            const similarity_val = cosineSimilarity(tfidf_vals[i], tfidf_vals[j]);
            addEventSimilarityById(events[i].eventid, events[j].eventid, similarity_val.toFixed(4));
            console.log("EventID: " + events[i].eventid + "&EventID:" + events[j].eventid + " " + similarity_val.toFixed(4));
        }
    }
}

// Pulls all events from db and decomposes the title
// and description into arrays of arrays of strings
function extractKeywordsFromEvents(events) {
    let events_keywords = []
    for (let i = 0; i < events.length; i++) {
        const words = convertTextToArray(events[i].eventdescription)
        .concat(convertTextToArray(events[i].eventname));
        events_keywords.push(words);
    }
    return events_keywords;
}

// Converts a string of text to an array of lowercase words
function convertTextToArray(text) {
    const arr_strings = text.match(/\b(\w+)'?(\w+)?\b/g);
    const lower_strings = [];
    arr_strings.forEach(word => {
        lower_strings.push(word.toLowerCase());
    })
    return lower_strings
}

// Populates an empty map with all words from another map with zeros
function populateWordMap(existing_map) {
    let new_map = {};
    for (let word in existing_map) {
        new_map[word] = 0;
    }
    return new_map;
}

// Incriments document map for each word that was in a specific event map
function incrimentDocMapFromEventMap(doc_freq_map, event_freq_map) {
    for (let word in event_freq_map) {
        if (event_freq_map[word] > 0) {
            doc_freq_map[word] = (doc_freq_map[word] || 0) + 1;
        }
    }
}

// Determines the dot product between 2 vectors
function dotProduct(vecA, vecB) {
    let product = 0;
    for(let i = 0; i < vecA.length; i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

// Determines the magnitude of a single vector
function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

// Determines the cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB)/ (magnitude(vecA) * magnitude(vecB));
}

