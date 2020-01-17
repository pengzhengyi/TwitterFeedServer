const { pullTweetsPeriodically } = require("../api/search.js");
const { getCollection } = require("./connect.js");
const { getCurrentTimestamp } = require("../util/timestamp.js");


function defaultSaveResultHandler(result) {
    console.log(`[i] (${getCurrentTimestamp()}) Saved ${result.insertedCount} tweets in database.`);
}
/**
 * Save pulled tweets each time to database.
 */
function streamingTweets(collection, query, callback=defaultSaveResultHandler) {
    pullTweetsPeriodically(query, undefined, (statuses) => {
        collection.insertMany(statuses, function(err, result) {
            if (err) {
                console.error("[✘] MongoDB Error: unable to save tweets. " + err);
                return;
            }

            callback(result);
        });
    });
}

function defaultGetTweetsHandler(tweets) {
    console.log(tweets);
}

const defaultReturnedTweetSize = 10;
/**
 * @param { String } query - The topic to search.
 * @param { Number } size - Number of tweets to return.
 * @param { (tweets: Array<any>) => void } callback - What happens to the returned tweets.
 */
function getRandomTweets(query, size=defaultReturnedTweetSize, callback=defaultGetTweetsHandler) {
    const collection = getCollection();
    collection.aggregate([
        {$match: {"from_query": query}},
        {$sample: {size}}
    ]).toArray(function(err, tweets) {
        if (err) {
            console.error("[✘] MongoDB Error: unable to sample random tweets. " + err);
            return;
        }

        callback(tweets);
    });
}

function getSortedTweets(query, size=defaultReturnedTweetSize, since_id=0, ascending=true, callback=defaultGetTweetsHandler) {
    const collection = getCollection();
    const options = { "from_query": query };
    if (ascending) {
        options["id_str"] = { $gt: `${since_id}` };
    }
    collection.find(options)
        .sort({ created_at: ascending ? 1 : -1})
        .limit( size )
        .toArray(function(err, tweets) {
            if (err) {
                console.error("[✘] MongoDB Error: unable to get sorted tweeets. " + err);
                return;
            }

            callback(tweets);
        });
}

module.exports = {
  streamingTweets, getRandomTweets, getSortedTweets
};