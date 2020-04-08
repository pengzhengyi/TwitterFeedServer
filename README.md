# TwitterFeedServer

A server for fetching and serving tweets.

## How to Use

+ `git clone https://github.com/pengzhengyi/TwitterFeedServer.git`
+ Fill **.env** file with Twitter API credentials and MongoDB credentials, refer to **.env.example** for some defaults.
+ Make sure recent versions of [node](https://nodejs.org/en/) and npm are used. Tested on node versions *v12.14.1* and *v13.6.0*.
  [How to install Node.js via binary archive on Linux](https://github.com/nodejs/help/wiki/Installation#how-to-install-nodejs-via-binary-archive-on-linux)
+ `npm install`
+ Run with pm2
  + Install [pm2](https://pm2.keymetrics.io)
      `npm install pm2@latest -g`
  + Run the server
      `npm run dev`, `npm run watch` (if you need hot reloading), or `npm run production`

## API Endpoints

Currently Active Server Address:

+ <http://ec2-3-92-185-155.compute-1.amazonaws.com>

### Fetching Tweets

Manages how the server will stream tweets from Twitter.

#### GET /streaming/list

List all queries that are used to stream tweets on this server

Caveats:

+ The database might contain tweets from unlisted queries, since those streamings might already be stopped.

Example Requests:

```bash
curl --request GET --url 'http://<fill IP address here>:<fill port number here>/streaming/list'
```

Example Response:

```json
{
    "activeStreamings":["noodle"]
    }
```

##### POST /streaming/start

**Start streaming tweets with query `q` from Twitter API**

Caveats:

+ If streaming already started for this query, this request is ignored.
+ Tweets will be stored in [MongoDB database (see MongoDB related fields in .env.example)](.env.example) with a memory limit (see [`MONGODB_TWEET_COLLECTION_SIZE_LIMIT` in .env.example](./.env.example))
+ Multiple streaming can be on for different query `q`, the memory limit is the total storage limit.
+ To avoid being rate limited, server will request [Twitter Search API](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets) every [interval (`API_REQUEST_DELAY` in .env.example](./.env.example) milliseconds

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.

Body data field (JSON) | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
lock | ✔ | | "cs1320" | If streaming lock for **/streaming/start** route (`STREAMING_START_USE_CONTROL_LOCK` is set to true) is enabled, the lock value needs to match the value for `STREAMING_START_CONTROL_LOCK`

 Example Requests:

```bash
curl --request POST -H "Content-Type: application/json" -d '{"lock": "cs1320"}' --url 'http://<fill IP address here>:<fill port number here>/streaming/start?q=noodle'
```

 Example Response:  
`OK`

---

##### POST /streaming/stop

**Stop streaming tweets with query `q` from Twitter API**

Caveats:

+ If streaming already stopped or has not started for this query, this request is ignored.
+ Stored tweets will not be deleted.

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.

Body data field (JSON) | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
lock | ✔ | | "cs1320" | If streaming lock for **/streaming/stop** route (`STREAMING_STOP_USE_CONTROL_LOCK` is set to true) is enabled, the lock value needs to match the value for `STREAMING_STOP_CONTROL_LOCK`

Example Requests:

```bash
curl --request POST -H "Content-Type: application/json" -d '{"lock": "cs1320"}' --url 'http://<fill IP address here>:<fill port number here>/streaming/stop?q=noodle'
```

Example Response:  
`OK`

---

##### POST /streaming/stopAll

Stop all streaming.

Body data field (JSON) | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
lock | ✔ | | "cs1320" | If streaming lock for **/streaming/stopAll** route (`STREAMING_STOPALL_USE_CONTROL_LOCK` is set to true) is enabled, the lock value needs to match the value for `STREAMING_STOPALL_CONTROL_LOCK`

Example Requests:

```bash
curl --request POST -H "Content-Type: application/json" -d '{"lock": "cs1320"}' --url 'http://<fill IP address here>:<fill port number here>/streaming/stopAll'
```

Example Response:  
`OK`

---

### Serving Tweets

Manages how applications can fetch tweets from the server.

[Tweet Object documentation from Twitter](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets#example-response)

#### GET /feed/random

**Randomly fetching `size` number of tweets with query `q`**

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.
size | ✘ | 10 | 1 | The number of tweets to return.

Example Requests:

```bash
curl --request GET --url 'http://<fill IP address here>:<fill port number here>/feed/random?q=noodle&size=1'
```

[**Example Response**](./example_responses/random.json)

---

#### GET /feed/timeline

**Fetching `size` number of tweets with query `q` created after that of a tweet specified by `since_id`, if `since_id` is not provided, fetching earliest tweets**

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.
size | ✘ | 10 | 1000 | The number of tweets to return.
since_id | ✘ | 0 | 1218491921196146689 | Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets which can be accessed through the API. If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.

Example Requests:

```bash
curl --request GET --url 'http://<fill IP address here>:<fill port number here>/feed/timeline?q=noodle&size=1000&since_id=1218491921196146689'
```

[**Example Response**](./example_responses/timeline.json)

---

#### GET /feed/newest

Fetching `size` number of most recent tweets with query `q`.

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.
size | ✘ | 10 | 5 | The number of tweets to return.

Example Requests:

```bash
curl --request GET --url 'http://<fill IP address here>:<fill port number here>/feed/newest?q=noodle&size=5'
```

[**Example Response**](./example_responses/newest.json)

---

#### GET /feed/example

**Fetching same tweets with query `q`, in implementation just the earliest 10 tweets about `q`**
This endpoint could be useful to test whether the server has streamed any tweets about `q`.

Query Param | Required | Default | Example | Description
:---: | :---: | :---: | :---: | ---
q | ✔ | | "noodle" | A UTF-8, URL-encoded search query of 500 characters maximum, including operators. Queries may additionally be limited by complexity.

Example Requests:

```bash
curl --request GET --url 'http://<fill IP address here>:<fill port number here>/feed/example?q=noodle'
```

[**Example Response**](./example_responses/example.json)
