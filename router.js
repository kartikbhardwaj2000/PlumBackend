const express = require('express');
const { CALLBACK_URI } = require('./constants');
const twitterClient = require('./twitterClient');
const twitterUserCLient = require('./twitterUserClient');
const fetchTweets = require('./fetchTweets');
const router = express.Router();

router.post('/login',async (req,res,next)=>{
    try {
        const data = await twitterClient.getRequestToken(CALLBACK_URI);
        res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${data.oauth_token}`);
    } catch (error) {
        next(error)
    }
})


router.get('/callback', async (req,res,next) =>{
    try {
        const data =   await twitterClient.getAccessToken({
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token
        })
        const userClient = twitterUserCLient(data.oauth_token,data.oauth_token_secret);
        const tweetsData = await fetchTweets(userClient,data.user_id);
        res.json(tweetsData);
    } catch (error) {
        next(error);
    }
})

module.exports = router;