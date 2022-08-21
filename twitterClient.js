const twitter = require('twitter-lite');
const { CONSUMER_KEY, CONSUMER_SECRET } = require('./constants');
const client = new twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET
});

module.exports = client;