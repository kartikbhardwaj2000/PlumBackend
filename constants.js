require('dotenv').config();
module.exports={
    PORT:process.env.PORT,
    CALLBACK_URI:process.env.CALLBACK_URI,
    CONSUMER_KEY:process.env.CONSUMER_KEY,
    CONSUMER_SECRET:process.env.CONSUMER_SECRET,
    MONGO_URI:process.env.MONGO_URI
}