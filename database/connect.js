const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_TWEET_DB_NAME, MONGODB_TWEET_COLLECTION_NAME } = require("../util/secrets.js");
const { createTweetsCollection } = require("./TweetCollection.js");

const MongoClient = require("mongodb").MongoClient;

function getMongoDBConnectionString() {
    return MONGODB_URL.replace("<username>", MONGODB_USERNAME).replace("<password>", encodeURIComponent(MONGODB_PASSWORD));
}
const connectionString = getMongoDBConnectionString();


const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
let tweets_db;

function connect(callback) {
    client.connect(err => {
        if (err) {
            console.error("[✘] MongoDB connection error. Please make sure MongoDB is running. " + err);
            process.exit();
        }

        console.log("[✔] Connected to MongoDB");
        tweets_db = client.db(MONGODB_TWEET_DB_NAME);
        createTweetsCollection(tweets_db, callback);
    });
}
function getDB() {
    return tweets_db;
}
function getCollection() {
    return tweets_db.collection(MONGODB_TWEET_COLLECTION_NAME);
}

module.exports = {
  connect, getDB, getCollection
};
