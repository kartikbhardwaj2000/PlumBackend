const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userId:{ type:String, required: true},
    data: mongoose.Schema.Types.Mixed
})

module.exports = new mongoose.model('users',userSchema);