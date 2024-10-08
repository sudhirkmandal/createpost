const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref:"user"}
    ],  
   
},{timestamps: true})

module.exports = mongoose.model("post", postSchema);