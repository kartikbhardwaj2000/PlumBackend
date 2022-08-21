const express = require('express');
const { CALLBACK_URI } = require('./constants');
const twitterClient = require('./twitterClient');
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
        const res =   await twitterClient.getAccessToken({
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token
        })
        res.json({
            accTkn: res.oauth_token,
            accTknSecret: res.oauth_token_secret,
            userId: res.user_id,
            screenName: res.screen_name
        });
        
    } catch (error) {
        next(error);
    }
})

module.exports = router;