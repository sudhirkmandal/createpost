const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/createcard")
.then(function(){
    console.log("Connected to MongoDB");
})
.catch(function(err){
    console.log("Error connecting to MongoDB", err);
})

const db = mongoose.connection;
module.exports = db;