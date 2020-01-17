import { getCollection } from "../database/connect.js";
import { getRandomTweets } from "../database/Tweet.js";

/**
 * GET /streaming/stop?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
export function randomTweets(req, res) {
  const query = req.query.q;
  let size = req.query.size;
  if (!query) {
    return res.sendStatus(400);
  }
  if (!size) {
    size = undefined;
  } else {
    size = Number.parseInt(size);
  }

  getRandomTweets(query, size, (tweets) => {
    console.log(`[i] Sending ${tweets.length} tweets about ${query}`);
    return res.status(200).json(tweets);
  });
}
