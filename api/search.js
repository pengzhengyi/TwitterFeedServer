import { client } from "./twitter.js";
import { API_REQUEST_DELAY } from "../util/secrets.js";

function defaultStatusHandler(statuses) {
  console.log(statuses);
}
/**
 * @param { Array } tweets - The returned tweets {@link https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object}
 */
function printNumberOfTweets(tweets) {
  console.log(`[✔] pulled ${tweets.length} tweets`);
}

let since_id = 0;
/**
 * Invoke the Search API {@link https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets}
 *
 * @param { String } q - search query.
 * @param { String } resultType - Specifies what type of search results you would prefer to receive.
 * @param { Number } count - The number of tweets to return per page, up to a maximum of 100.
 * @param { Boolean } timelined - Whether the tweets are fetched in chronological order (so there isn't repeating tweets).
 * @param { (statuses: Array) => void } callback - How the returned tweets are handled.
 */
export function search(q, resultType="recent", count=100, timelined=true, callback=defaultStatusHandler) {
  const param = {q, result_type: resultType, count, include_entities: 1, since_id };
  client.get('search/tweets', param)
    .then(tweets => {
      const { statuses, search_metadata } = tweets;

      if (timelined) {
        since_id = search_metadata.max_id_str;
      }

      if (Array.isArray(statuses) && statuses.length) {
        callback(statuses);
      }
    })
    .catch(error => {
      console.error("[✘] Error communicating with Twitter api");
      console.error(error);
    });
}

let pullingTimeout;

/**
 * @param { String } query - The topic to search.
 * @param { Number } delay - how long to start a new search in miliseconds.
 * @param { (statuses: any) => void } callback - What to do with the returned tweets.
 */
export function pullTweetsPeriodically(query, delay=API_REQUEST_DELAY, callback=printNumberOfTweets) {
  pullingTimeout = setInterval(() => search(query, undefined, undefined, undefined, callback), delay);
}