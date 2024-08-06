const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const isLoggedIn = require('../middlewares/login-middleware');
const upload = require('../config/multer-config');
const postModel = require("../models/post-model")


router.get("/", function(req, res){
    let err = req.flash('error')
    let success = req.flash('success')
    res.render("index",{loggedin:false, error:err, success:success})
})

router.post("/register", async function(req, res){
    try {
       let {name, email, username, password} = req.body;
       let user = await userModel.findOne({email})
       if(user){
        req.flash("error", "User already exists")
        return res.redirect("/")
       }

       bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, async function(err, hash){
            user = await userModel.create({
                name,
                email,
                username,
                password: hash
            })
            let token = jwt.sign({email, id:user._id}, process.env.JWT_SECRET)
            res.cookie("token", token)
            req.flash("success", "Registration successful, please login");
            res.redirect("/")
        } )
       })

    } catch (error) {
        res.send("error")
    }
})

router.post("/login", async function(req, res){
    try {
       let {email, password} =  req.body;
       let user = await userModel.findOne({email})
       if(!user){
        req.flash("error", "Email or password did not match")
        return res.redirect("/")
       } 
       let match = await bcrypt.compare(password, user.password)
       if(!match){
        req.flash("error", "Email or password did not match")
        return res.redirect("/")
       }
       let token = jwt.sign({email, id:user._id}, process.env.JWT_SECRET)
       res.cookie("token", token)
       res.redirect("/profile")
    } catch (error) {
        res.send("error")
    }
})

router.get("/profile", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email:req.user.email}).populate("posts")
    res.render("profile", {user});
})

router.get("/logout", function(req, res){
    res.cookie("token", "");
    req.flash("success", "Logged out successfully")
    res.redirect("/")
})

router.post("/upload", isLoggedIn, upload.single("image"), async function(req, res){
    let user = await userModel.findOne({email:req.user.email})
    user.profilepic = req.file.buffer.toString("base64")
    await user.save()
    res.redirect("/profile")
})

router.get("/create", isLoggedIn, async function(req, res){
    res.render("create")
})

router.post("/post", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({email:req.user.email})
    let post = await postModel.create({
        content: req.body.content,
        user: user._id
    })
    user.posts.push(post._id);
    await user.save()
    res.redirect("/profile")
})

router.get("/like/:id", isLoggedIn, async function(req, res){
    let post = await postModel.findOne({_id:req.params.id}).populate("user")

    if(post.likes.indexOf(req.user.id) === -1) {
        post.likes.push(req.user.id)
    }else{
        post.likes.splice(post.likes.indexOf(req.user.id), 1)       
    }
    await post.save()
    res.redirect("/profile")
})

router.get("/edit/:id", isLoggedIn, async function(req, res){
    let post = await postModel.findOne({_id:req.params.id}).populate("user")
    res.render("edit",{post})
})

router.post("/update/:id", isLoggedIn, async function(req, res){
    let post = await postModel.findOneAndUpdate({_id:req.params.id}, {content:req.body.content})
    res.redirect("/profile")
})


module.exports = router