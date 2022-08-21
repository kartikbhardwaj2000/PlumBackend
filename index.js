const express = require('express');
const mongoose = require('mongoose');
const { route } = require('./router');
const router = require('./router');
const { PORT, MONGO_URI } = require("./constants");
const errorHandler = require('./utils/errorHandler');
const app = express();


//connect to mongodb atlas instance
mongoose.connect(MONGO_URI,(err) => {
    if(err)
    {
        console.log(err);
        process.exit(1);
    }
    console.log('mongodb connected ');
})

app.set('view engine', 'ejs')

app.use(router);

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`app running ar PORT ${PORT}`);
})