import mongodb from "mongodb";
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_TWEET_DB_NAME, MONGODB_TWEET_COLLECTION_NAME } from "../util/secrets.js";
import { createTweetsCollection } from "./TweetCollection.js";
import { pullTweetsPeriodically } from "../api/search.js";

const MongoClient = mongodb.MongoClient;

function getMongoDBConnectionString() {
  return MONGODB_URL.replace("<username>", MONGODB_USERNAME).replace("<password>", encodeURIComponent(MONGODB_PASSWORD));
}
const connectionString = getMongoDBConnectionString();


const client = new MongoClient(connectionString, { useNewUrlParser: true, auto_reconnect : true });
let tweets_db;

export function connect(callback) {
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
export function getDB() {
  return tweets_db;
}
export function getCollection() {
  return tweets_db.collection(MONGODB_TWEET_COLLECTION_NAME);
}
