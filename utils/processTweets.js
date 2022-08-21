function processTweets(tweetsData){
    const tweetsWithLink = tweetsData.tweets.filter(tweet => {
        if(!tweet.entities)
        {
            return false;
        }
        return tweet.entities.urls
    });
    const tweetsText = tweetsWithLink.map(tweet => {
        return tweet.text;
    });
    const userLinksMap ={};
    const DomainFrequencyMap ={};
    const userNameMap = {};
    tweetsData.users.forEach(user=>{
        userNameMap[user.id] = user.name
    });

    tweetsWithLink.forEach(tweet =>{
        if(!userLinksMap[tweet.author_id])
        {
            userLinksMap[tweet.author_id]=[];
        }
        tweet.entities.urls.forEach(url => {
            userLinksMap[tweet.author_id].push(url.expanded_url)
            let urlObj = new URL(url.expanded_url);
            let domain = urlObj.hostname;
            if(!DomainFrequencyMap[domain])
            {
                DomainFrequencyMap[domain] =0;
            }
            DomainFrequencyMap[domain]++;
        })
    })
    let users = Object.keys(userLinksMap).map(userId=>{
        return {
            name:userNameMap[userId],
            linksCount:userLinksMap[userId].length
        }
    })
     users.sort((user1,user2)=>{
        return user2.linksCount - user1.linksCount;
     })
     let domains = Object.keys(DomainFrequencyMap).map(domainName => {
        return {
            domain:domainName,
            frequency: DomainFrequencyMap[domainName]
        }
     })
     domains.sort((domain1,domain2)=>{
        return domain2.frequency - domain1.frequency
     })
     
    return {
       tweets:tweetsText,domains,users
    }
}
module.exports = processTweets;