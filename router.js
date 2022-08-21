const express = require('express');
const { CALLBACK_URI } = require('./constants');
const twitterClient = require('./twitterClient');
const twitterUserCLient = require('./twitterUserClient');
const fetchTweets = require('./fetchTweets');
const userModel = require('./models/user.model');
const processTweets = require('./processTweets');
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
        if(!req.query.oauth_verifier)
        {
           return res.send('permission is required for processing');
        }
        const data =   await twitterClient.getAccessToken({
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token
        })

        const userClient = twitterUserCLient(data.oauth_token,data.oauth_token_secret);
        const tweetsData = await fetchTweets(userClient,data.user_id);
       
        res.render('dashboard',processTweets(tweetsData));
        const user = await userModel.findOne({userId:data.user_id});
        if(!user)
        {
           const doc = await userModel.create({userId:data.user_id,data:tweetsData});
        }else {
            user.data = tweetsData;
            await user.save();
        }
    } catch (error) {
        next(error);
    }
})
module.exports = router;