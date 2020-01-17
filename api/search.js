const fs = require("fs");
const { client } = require("./twitter.js");
const { API_REQUEST_DELAY } = require("../util/secrets.js");

function defaultStatusHandler(statuses) {
    console.log(statuses);
}
/**
 * @param { Array } tweets - The returned tweets {@link https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object}
 */
function printNumberOfTweets(tweets) {
    console.log(`[✔] pulled ${tweets.length} tweets`);
}

const sinceIDStoredFilename = ".since_id.json";
function loadSinceID() {
    if (fs.existsSync(sinceIDStoredFilename)) {
    // assume no tweets has been fetched
        return 0;
    } else {
        console.log("[✔] Resume from last search timeline");
        return JSON.parse(fs.readFileSync(sinceIDStoredFilename, "utf8")).since_id;
    }
}
let since_id = loadSinceID;
function updateSinceID(newSinceID) {
    // save in memory
    since_id = newSinceID;
    fs.writeFileSync(sinceIDStoredFilename, JSON.stringify({ since_id }));
}

/**
 * Invoke the Search API {@link https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets}
 *
 * @param { String } q - search query.
 * @param { String } resultType - Specifies what type of search results you would prefer to receive.
 * @param { Number } count - The number of tweets to return per page, up to a maximum of 100.
 * @param { Boolean } timelined - Whether the tweets are fetched in chronological order (so there isn't repeating tweets).
 * @param { (statuses: Array) => void } callback - How the returned tweets are handled.
 */
function search(q, resultType="recent", count=100, timelined=true, callback=defaultStatusHandler) {
    const param = {q, result_type: resultType, count, include_entities: 1, since_id };
    client.get("search/tweets", param)
        .then(tweets => {
            const { statuses, search_metadata } = tweets;

            if (timelined) {
                updateSinceID(search_metadata.max_id_str);
            }

            if (Array.isArray(statuses) && statuses.length) {
                statuses.forEach(status => {
                    status.from_query = q;
                    status.created_at = new Date(status.created_at);
                });
                callback(statuses);
            }
        })
        .catch(error => {
            console.error("[✘] Error communicating with Twitter api");
            console.error(error);
        });
}

const pullingTimeouts = new Map();

/**
 * @param { String } query - The topic to search.
 * @param { Number } delay - how long to start a new search in miliseconds.
 * @param { (statuses: any) => void } callback - What to do with the returned tweets.
 */
function pullTweetsPeriodically(query, delay=API_REQUEST_DELAY, callback=printNumberOfTweets) {
    if (pullingTimeouts.has(query)) {
    // streaming already started
        return;
    }
    const pullingTimeout = setInterval(() => search(query, undefined, undefined, undefined, callback), delay);
    pullingTimeouts.set(query, pullingTimeout);
}

function stopPullTweetsPeriodically(query) {
    if (pullingTimeouts.has(query)) {
        const pullingTimeout = pullingTimeouts.get(query);
        clearInterval(pullingTimeout);
        pullingTimeouts.delete(query);
    }
}

function stopAllPullTweetsPeriodically() {
    for (const pullingTimeout of pullingTimeouts.values()) {
        clearInterval(pullingTimeout);
    }
    pullingTimeouts.clear();
}

module.exports = {
  search, pullTweetsPeriodically, stopPullTweetsPeriodically, stopAllPullTweetsPeriodically
};