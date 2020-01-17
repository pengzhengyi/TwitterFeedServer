import { pullTweetsPeriodically } from "../api/search.js";


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