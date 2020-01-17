import mongodb from "mongodb";
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_TWEET_DB_NAME } from "../util/secrets.js";
import { createTweetsCollection } from "./TweetCollection.js";

const MongoClient = mongodb.MongoClient;

function getMongoDBConnectionString() {
  return MONGODB_URL.replace("<username>", MONGODB_USERNAME).replace("<password>", encodeURIComponent(MONGODB_PASSWORD));
}
const connectionString = getMongoDBConnectionString();


const client = new MongoClient(connectionString, { useNewUrlParser: true, auto_reconnect : true });

client.connect(err => {
  if (err) {
    console.error("[✘] MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
  }

  console.log("[✔] Connected to MongoDB");
  const db = client.db(MONGODB_TWEET_DB_NAME);
  createTweetsCollection(db, function() {
    client.close();
  });

  client.close();
});
