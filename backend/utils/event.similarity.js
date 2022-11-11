import { getAllEventsDb } from "../db/event.db.js";

console.log(convertTextToArray("hello dhsdas DSDAjsds sdada dsadaJ DJJDJS ss. sdsadas! ffssda"))
updateAllEventSimilarity();


async function updateAllEventSimilarity() {
    let event_keywords = await extractKeywordsFromEvents();
    console.log(events_keywords);
    // Insert all words into hashmap so no duplicates
    let all_word_occ = {}
    for (let i = 0; i < event_keywords.length; i++) {
        for (let j = 0; j < event_keywords[i].length; j++) {
            all_word_occ[event_keywords[i][j]] = true;
        }
    }
    console.log(all_word_occ);

    // Convert hashmap to 3D array

    for (let i = 0; i < event_keywords.length; i++) {
        for (let j = 0; j < event_keywords[i].length; j++) {
            all_word_occ[event_keywords[i][j]] = true;
        }
    }
}

// Converts a string of text to an array of lowercase words
function convertTextToArray(text) {
    const arrStrings = text.match(/\b(\w+)'?(\w+)?\b/g);
    const lowerStrings = [];
    arrStrings.forEach(word => {
        lowerStrings.push(word.toLowerCase());
    })
    return lowerStrings
}


// Pulls all events from db and decomposes the title
// and description into arrays of arrays of strings
async function extractKeywordsFromEvents() {
    const events = await getAllEventsDb();
    let events_keywords = []
    for (let i = 0; i < events.length; i++) {
        const words = concat(convertTextToArray(events[i].eventdescription), 
        convertTextToArray(events[i].eventname));
        events_keywords.push(words);
    }
    console.log(events_keywords);
    return events_keywords;
}


function textCosineSimilarity(eventA_desc, eventA_title, eventB_desc, eventB_title) {
    
    let dict = {};
    addWordsToDictionary(wordCountA,dict);
    addWordsToDictionary(wordCountB,dict);
    const vectorA = wordMapToVector(wordCountA,dict);
    const vectorB = wordMapToVector(wordCountB,dict);
    return cosineSimilarity(vectorA, vectorB);
}






// Accumulates 
function addWordsToDictionary(wordCountmap, dict){
    for(let key in wordCountmap){
        dict[key] = true;
    }
}

function dotProduct(vecA, vecB){
    let product = 0;
    for(let i=0;i<vecA.length;i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec){
    let sum = 0;
    for (let i = 0;i<vec.length;i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(vecA,vecB){
    return dotProduct(vecA,vecB)/ (magnitude(vecA) * magnitude(vecB));
}

