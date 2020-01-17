import { client } from "./twitter.js";

function defaultStatusHandler(statuses) {
  console.log(statuses);
}

export function search(q, resultType="recent", count=100, callback=defaultStatusHandler) {
  const param = {q, resultType, count};
  client.get('search/tweets', param, function(error, tweets, response) {
    if (error) {
      console.error(error);
      return;
    }

    const statuses = tweets.statuses;
    if (Array.isArray(statuses) && statuses.length) {
      callback(statuses);
    }
  });
}