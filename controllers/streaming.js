import { getCollection } from "../database/connect.js";
import { streamingTweets } from "../database/Tweet.js";
import { stopPullTweetsPeriodically } from "../api/search.js";

/**
 * GET /streaming/start?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
export function startStreamingTweets(req, res) {
  const query = req.query.q;
  if (!query) {
    return res.sendStatus(400);
  }

  const collection = getCollection();
  streamingTweets(collection, query);
  console.log(`[✔] Streaming started for ${query}`);
  return res.sendStatus(200);
}

/**
 * GET /streaming/stop?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
export function stopStreamingTweets(req, res) {
  const query = req.query.q;
  if (!query) {
    return res.sendStatus(400);
  }

  stopPullTweetsPeriodically(query);
  console.log(`[✔] Streaming stoped for ${query}`);
  return res.sendStatus(200);
}
