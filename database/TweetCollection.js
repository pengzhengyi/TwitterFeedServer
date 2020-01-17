import { MONGODB_TWEET_DB_NAME, MONGODB_TWEET_COLLECTION_NAME, MONGODB_TWEET_COLLECTION_SIZE_LIMIT } from "../util/secrets.js";

export function createTweetsCollection(db, callback) {
  db.createCollection(MONGODB_TWEET_COLLECTION_NAME, { capped: true, size: MONGODB_TWEET_COLLECTION_SIZE_LIMIT }, function(err) {
    if (err) {
      console.error(`[✘] MongoDB unable to create ${MONGODB_TWEET_COLLECTION_NAME} collection ${err}`);
      process.exit();
    }

    console.log(`[✔] ${MONGODB_TWEET_COLLECTION_NAME} collection created`);
    callback();
  });
}
