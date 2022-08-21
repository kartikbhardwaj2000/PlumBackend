const twitter = require('twitter-lite');
const { CONSUMER_KEY, CONSUMER_SECRET } = require('../constants');
const createUserClient = function(access_token_key, access_token_secret){
    const client = new twitter({
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        access_token_key,
        access_token_secret,
        extension:null,
        version:2,
    });
    
    return client;
}

module.exports = createUserClient;