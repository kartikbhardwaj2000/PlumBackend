async function fetchTweets(userClient, userId) {
    // time for 7days earlier.
    const startTime= new Date(Date.now()-7*24*60*60*1000).toISOString();
    const firstPage= await userClient.get(`users/${userId}/timelines/reverse_chronological`,{
        start_time:startTime,
        "tweet.fields":"entities,author_id",
        "expansions":"author_id"
    });
    if(firstPage.meta.result_count ==0)
    {
        return {
            tweets:[],
            users:[],
            fetches:0
        }
    }
    let tweets =[...firstPage.data];
    let usersMap={}
    let fetches =1;
    let paginationToken=firstPage.meta.next_token;
    let flag = paginationToken?true:false;
    while(flag)
    {
        let nextPage =  await userClient.get(`users/${userId}/timelines/reverse_chronological`,{
            pagination_token:paginationToken,
            start_time:new Date(Date.now()-7*24*60*60*1000).toISOString(),
            "tweet.fields":"entities,author_id",
            "expansions":"author_id"
           });
           if(nextPage.data)
           {
               fetches++;
               tweets.push.apply(tweets,nextPage.data);
               nextPage.includes.users.forEach(user => {
                usersMap[user.id]=user;
            });
           }
          
           if(nextPage.meta.next_token==null)
           {
               console.log("fetched successfully")
               flag = false;
           }
           paginationToken=nextPage.meta.next_token;
    }
    let users = Object.keys(usersMap).map(userId=>{
        return usersMap[userId];
    })
    return {
        tweets,
        users,
        fetches
    }

}
module.exports = fetchTweets;