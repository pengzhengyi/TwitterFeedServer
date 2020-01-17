import { pullTweetsPeriodically } from "../api/search.js";
import { getCollection } from "./connect.js";


function defaultSaveResultHandler(result) {
    console.log(`[i] (${new Date().toLocaleTimeString()}) Saved ${result.insertedCount} tweets in database.`);
}
/**
 * Save pulled tweets each time to database.
 */
export function streamingTweets(collection, query, callback=defaultSaveResultHandler) {
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

/**
 * @param { String } query - The topic to search.
 * @param { Number } size - Number of tweets to return.
 * @param { (tweets: Array<any>) => void } callback - What happens to the returned tweets.
 */
export function getRandomTweets(query, size=10, callback=defaultGetTweetsHandler) {
  const collection = getCollection();
  return collection.aggregate([
    {$match: {"from_query": query}},
    {$sample: {size}}
  ]).toArray(function(err, tweets) {
    if (err) {
      console.error("[✘] MongoDB Error: unable to sample tweets. " + err);
      return;
    }

    callback(tweets);
  });
}