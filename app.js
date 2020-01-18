const express = require("express");
const { PORT_NUM } = require("./util/secrets.js");
const { queryValidationMiddleware, sizeValidationMiddleware, hasStreamingLockMiddleware } = require("./validators/validation.js");
const { startStreamingTweets, stopStreamingTweets, stopAllStreamingTweets } = require("./controllers/streaming.js");
const { randomTweets, timelineTweets, newestTweets, exampleTweets } = require("./controllers/feed.js");


// Create Express server
const app = express();
app.use(express.json());

// Express configuration
app.set("port", process.env.PORT || PORT_NUM);

app.get("/", function(req, res) {
  res.status(200).send('<p>Welcome, you have reached Twitter Feed Server. Look at <a href="https://github.com/pengzhengyi/TwitterFeedServer#api-endpoints" target="_blank" rel="noopener noreferrer" title="API Doc"> API Documentation.</p>');
});

app.post("/streaming/start", [queryValidationMiddleware, hasStreamingLockMiddleware], startStreamingTweets);
app.post("/streaming/stop", [queryValidationMiddleware, hasStreamingLockMiddleware], stopStreamingTweets);
app.post("/streaming/stopAll", hasStreamingLockMiddleware, stopAllStreamingTweets);

app.get("/feed/random", [queryValidationMiddleware, sizeValidationMiddleware], randomTweets);
app.get("/feed/timeline", [queryValidationMiddleware, sizeValidationMiddleware], timelineTweets);
app.get("/feed/newest", [queryValidationMiddleware, sizeValidationMiddleware], newestTweets);
app.get("/feed/example", [queryValidationMiddleware], exampleTweets);

// handle missing pages
app.get("*", function(req, res) {
    res.sendStatus(404);
});

module.exports = app;
