const { getCollection } = require("../database/connect.js")
const { getRandomTweets, getSortedTweets } = require("../database/Tweet.js")
const { getCurrentTimestamp } = require("../util/timestamp.js")


function buildSearchMetadata(req, statuses) {
  return {
    query: req.query.q,
    count: statuses.length,
  };
}


/**
 * GET /feed/random?q=...&size=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function randomTweets(req, res) {
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

    getRandomTweets(query, size, (statuses) => {
        const search_metadata = buildSearchMetadata(req, statuses);
        console.log(`[i] (${getCurrentTimestamp()}) Sending ${search_metadata.count} random tweets about ${query}`);
        return res.status(200).json({statuses, search_metadata});
    });
}

const sinceIDRegex = /since_id=\d+/;
/**
 * GET /feed/timeline?q=...&size=...&since_id=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function timelineTweets(req, res) {
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
        since_id = 0;
    }

    getSortedTweets(query, size, since_id, true, (statuses) => {
        const search_metadata = buildSearchMetadata(req, statuses);
        if (search_metadata.count >= 1) {
            const earliestTweet = statuses[0];
            const latestTweet = statuses[search_metadata.count - 1];
            const earliestTweetCreatedTime = new Date(earliestTweet.created_at).toString();
            const latestTweetCreatedTime = new Date(latestTweet.created_at).toString();
            console.log(`[i] (${getCurrentTimestamp()}) Sending ${search_metadata.count} tweets about ${query}, the earliest tweet was created at ${earliestTweetCreatedTime} and the latest tweet was created at ${latestTweetCreatedTime}`);

            search_metadata.max_id = latestTweet.id;
            search_metadata.max_id_str = latestTweet.id_str;

            const url = req.originalUrl;
            const nextSinceID = latestTweet.id_str;
            if (sinceIDRegex.test(url)) {
              search_metadata.refresh_url = url.replace(sinceIDRegex, `since_id=${nextSinceID}`);
            } else {
              search_metadata.refresh_url = `${url}&since_id=${nextSinceID}`;
            }
        } else {
            console.log(`[i] (${getCurrentTimestamp()}) Unable to find later tweets about ${query} after ${since_id}`);
        }

        return res.status(200).json({ statuses, search_metadata });
    });
}

/**
 * GET /feed/newest?q=...&size=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function newestTweets(req, res) {
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

    getSortedTweets(query, size, undefined, false, (statuses) => {
        const search_metadata = buildSearchMetadata(req, statuses);
        console.log(`[i] (${getCurrentTimestamp()}) Sending ${search_metadata.count} most recent tweets about ${query}`);
        if (search_metadata.count >= 1) {
            const earliestTweet = statuses[search_metadata.count - 1];
            const latestTweet = statuses[0];
            const earliestTweetCreatedTime = new Date(earliestTweet.created_at).toString();
            const latestTweetCreatedTime = new Date(latestTweet.created_at).toString();
            console.log(`[i] (${getCurrentTimestamp()}) Sending ${search_metadata.count} tweets about ${query}, the earliest tweet was created at ${earliestTweetCreatedTime} and the latest tweet was created at ${latestTweetCreatedTime}`);

            search_metadata.max_id = latestTweet.id;
            search_metadata.max_id_str = latestTweet.id_str;

            const url = req.originalUrl;
            const nextSinceID = latestTweet.id_str;
            search_metadata.refresh_url = `${url.replace("newest", "timeline")}&since_id=${nextSinceID}`;
        } else {
            console.log(`[i] (${getCurrentTimestamp()}) Unable to find any tweets about ${query}`);
        }

        return res.status(200).json({ statuses, search_metadata });
    });
}

/**
 * GET /feed/example?q=...
 *
 * @param { Request } req - Request.
 * @param { Response } res - Response.
 */
function exampleTweets(req, res) {
    const query = req.query.q;
    if (!query) {
        return res.sendStatus(400);
    }
    getSortedTweets(query, undefined, undefined, true, (statuses) => {
        const search_metadata = buildSearchMetadata(req, statuses);
        console.log(`[i] (${getCurrentTimestamp()}) Sending first ${search_metadata.count} tweets about ${query}`);
        return res.status(200).json({ statuses, search_metadata });
    });
}

module.exports = {
  randomTweets, timelineTweets, newestTweets, exampleTweets
};
