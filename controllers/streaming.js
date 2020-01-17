const { getCollection } = require("../database/connect.js");
const { streamingTweets } = require("../database/Tweet.js");
const { stopPullTweetsPeriodically, stopAllPullTweetsPeriodically } = require("../api/search.js");

/**
 * GET /streaming/start?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function startStreamingTweets(req, res) {
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
function stopStreamingTweets(req, res) {
    const query = req.query.q;
    if (!query) {
        return res.sendStatus(400);
    }

    stopPullTweetsPeriodically(query);
    console.log(`[✔] Streaming stoped for ${query}`);
    return res.sendStatus(200);
}

/**
 * GET /streaming/stopall
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function stopAllStreamingTweets(req, res) {
    stopAllPullTweetsPeriodically();
    console.log("[✔] Streaming stoped for all");
    return res.sendStatus(200);
}

module.exports = {
  startStreamingTweets, stopStreamingTweets, stopAllStreamingTweets
};
