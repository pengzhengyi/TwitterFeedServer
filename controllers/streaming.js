const { getCollection } = require("../database/connect.js");
const { streamingTweets } = require("../database/Tweet.js");
const { listActiveStreamings, stopPullTweetsPeriodically, stopAllPullTweetsPeriodically } = require("../api/search.js");
const { validationErrorHandler } = require("../validators/validation.js");

/* GET /streaming/list
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function listStreamings(req, res) {
    const streamingNames = listActiveStreamings();
    console.log(`[i] Listing active streamings ${streamingNames}`);
    return res.status(200).json({ activeStreamings: streamingNames });
}


/**
 * POST /streaming/start?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function startStreamingTweets(req, res) {
    if (!validationErrorHandler(req, res)) {
      // Error in validation
      return;
    }

    const query = req.query.q;

    const collection = getCollection();
    streamingTweets(collection, query);
    console.log(`[✔] Streaming started for ${query}`);
    return res.sendStatus(200);
}

/**
 * POST /streaming/stop?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function stopStreamingTweets(req, res) {
    if (!validationErrorHandler(req, res)) {
      // Error in validation
      return;
    }
    const query = req.query.q;

    stopPullTweetsPeriodically(query);
    console.log(`[✔] Streaming stoped for ${query}`);
    return res.sendStatus(200);
}

/**
 * POST /streaming/stopAll
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function stopAllStreamingTweets(req, res) {
    if (!validationErrorHandler(req, res)) {
      // Error in validation
      return;
    }

    stopAllPullTweetsPeriodically();
    console.log("[✔] Streaming stoped for all");
    return res.sendStatus(200);
}

module.exports = {
  listStreamings,
  startStreamingTweets,
  stopStreamingTweets,
  stopAllStreamingTweets
};
