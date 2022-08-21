const twitter = require('twitter-lite');
const  express = require("express");
const app = express();

const client = new twitter({
    consumer_key: "5jPwCAzBCvCfmcV8Ws2zALiY7",
    consumer_secret: "1GE8xzrsH3Hyxh2ErrqHQNGyyFjAMyasHtNJPfcFRHAVDKnkj7"
});
let accessT,accessSec,userId,paginationToken;

app.get("/callback", async function (req, response) {
    try {
      console.log(req.query);
      await client.getAccessToken({
    oauth_verifier: req.query.oauth_verifier,
    oauth_token: req.query.oauth_token
  })
  .then( async (res) =>{
    console.log({
        accTkn: res.oauth_token,
        accTknSecret: res.oauth_token_secret,
        userId: res.user_id,
        screenName: res.screen_name
      });
      accessT=res.oauth_token;
      accessSec=res.oauth_token_secret;
      userId=res.user_id;

      const client2 = new twitter({
        extension:null,
        version:2,
        consumer_key: "5jPwCAzBCvCfmcV8Ws2zALiY7",
        consumer_secret: "1GE8xzrsH3Hyxh2ErrqHQNGyyFjAMyasHtNJPfcFRHAVDKnkj7",
        access_token_key: accessT,
        access_token_secret: accessSec
    });
   const res2= await client2.get(`users/${res.user_id}/timelines/reverse_chronological`,{
            start_time:new Date(Date.now()-7*24*60*60*1000).toISOString(),
            "tweet.fields":"entities,author_id",
            "expansions":"author_id"
       })
      paginationToken=res2.meta.next_token;
      response.send(res2);
    //   response.json(res);
  }
    
  )
  .catch(console.error);
    } catch (error) {
      console.log(error);
    }
  });
  
  app.get("/login", async function (req, response) {
    await client
  .getRequestToken("https://plum-top-links.herokuapp.com/callback")
  .then(res =>{
      console.log({
        reqTkn: res.oauth_token,
        reqTknSecret: res.oauth_token_secret
      }) 
      response.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauth_token}`)
  }
   
  )
  .catch(console.error);

  });
  
  app.get("/tweets", async function (req, res) {
    const client2 = new twitter({
        extension:null,
        version:2,
        consumer_key: "5jPwCAzBCvCfmcV8Ws2zALiY7",
        consumer_secret: "1GE8xzrsH3Hyxh2ErrqHQNGyyFjAMyasHtNJPfcFRHAVDKnkj7",
        access_token_key: accessT,
        access_token_secret: accessSec
    });
    let flag = true;
    let data = [];
    let users =[];
    while(flag)
    {
        await client2.get(`users/${userId}/timelines/reverse_chronological`,{
            pagination_token:paginationToken,
            start_time:new Date(Date.now()-7*24*60*60*1000).toISOString(),
            "tweet.fields":"entities,author_id",
            "expansions":"author_id"
           }).then(
            res2=>{
                if(res2.data)
                {
                    data.push.apply(data,res2.data);
                    users.push.apply(users,res2.includes.users);
                    console.log(res2.data);
                }
               
                if(res2.meta.next_token==null)
                {
                    console.log("end reached")
                    flag = false;
                }
                paginationToken=res2.meta.next_token;
            }
          ).catch(error=>console.log(error));
    }
    res.json({
        data,
        users
    });
       
  });
  
  app.get("/revoke", async function (req, res) {
    // try {
    //   const response = await authClient.revokeAccessToken();
    //   res.send(response);
    // } catch (error) {
    //   console.log(error);
    // }
  });
  
  app.listen(process.env.PORT, () => {
    console.log(`Go here to login: http://127.0.0.1:3000/login`);
  });
  


