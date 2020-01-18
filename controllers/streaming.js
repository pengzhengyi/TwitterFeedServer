const { getCollection } = require("../database/connect.js");
const { streamingTweets } = require("../database/Tweet.js");
const { stopPullTweetsPeriodically, stopAllPullTweetsPeriodically } = require("../api/search.js");
const { validationErrorHandler } = require("../validators/validation.js");

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
  startStreamingTweets, stopStreamingTweets, stopAllStreamingTweets
};
