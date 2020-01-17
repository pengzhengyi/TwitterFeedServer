const { MONGODB_TWEET_COLLECTION_NAME, MONGODB_TWEET_COLLECTION_SIZE_LIMIT } = require("../util/secrets.js");

function createTweetsCollection(db, callback) {
    db.createCollection(MONGODB_TWEET_COLLECTION_NAME, { capped: true, size: MONGODB_TWEET_COLLECTION_SIZE_LIMIT }, function(err) {
        if (err) {
            console.error(`[✘] MongoDB unable to create ${MONGODB_TWEET_COLLECTION_NAME} collection ${err}`);
            process.exit();
        }

        console.log(`[✔] ${MONGODB_TWEET_COLLECTION_NAME} collection created`);

        const tweetsCollection = db.collection(MONGODB_TWEET_COLLECTION_NAME);
        tweetsCollection.createIndex({ id_str: 1, from_query: 1 }, { unique: true }, function (err, result) {
            if (err) {
                console.error(`[✘] MongoDB unable to create unique index for id_str ${err}`);
                process.exit();
            }

            console.log("[✔] Created unique index for id_str, guarantee no repeated tweets saved.");
            callback();
        });
    });
}

module.exports = {
  createTweetsCollection
}
