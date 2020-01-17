import { getCollection } from "../database/connect.js";
import { getRandomTweets, getSortedTweets } from "../database/Tweet.js";
import { getCurrentTimestamp } from "../util/timestamp.js";

/**
 * GET /feed/random?q=...&size=...
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
    console.log(`[i] (${getCurrentTimestamp()}) Sending ${tweets.length} random tweets about ${query}`);
    return res.status(200).json({tweets});
  });
}

/**
 * GET /feed/sorted?q=...&size=...&since_id=...&order=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
export function sortedTweets(req, res) {
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
  let since_id = req.query.since_id;
  if (!since_id) {
    since_id = undefined;
  }
  const order = req.query.order;
  let ascending;
  if (!order) {
    ascending = true;
  } else {
    ascending = order === "asc";
  }

  getSortedTweets(query, size, since_id, ascending, (tweets) => {
    console.log(`[i] (${getCurrentTimestamp()}) Sending ${tweets.length} chronologically sorted tweets about ${query}`);

    let next_since_id = "0";
    if (ascending) {
      const lastTweet = tweets[tweets.length - 1];
      next_since_id = lastTweet.id_str;
    }

    const toSend = {
      tweets,
      order: ascending ? "asc": "desc",
    };
    if (ascending) {
      toSend["next_since_id"] = next_since_id;
    }
    return res.status(200).json(toSend);
  });
}

/**
 * GET /feed/same?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
export function sameTweets(req, res) {
  const query = req.query.q;
  if (!query) {
    return res.sendStatus(400);
  }
  getSortedTweets(query, undefined, undefined, true, (tweets) => {
    console.log(`[i] (${getCurrentTimestamp()}) Sending first ${tweets.length} tweets about ${query}`);

    return res.status(200).json({ tweets });
  });
}
