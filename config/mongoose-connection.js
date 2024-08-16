const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://sudhirkmandal6:mern@cluster0.4hp05.mongodb.net/")
.then(function(){
    console.log("Connected to MongoDB");
})
.catch(function(err){
    console.log("Error connecting to MongoDB", err);
})

const db = mongoose.connection;
module.exports = db;