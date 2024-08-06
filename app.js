const express = require('express');
const app = express();
const path = require('path');
const indexRouter = require("./routes/index-router")
const db = require("./config/mongoose-connection")
const flash = require("connect-flash");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

dotenv.config();

app.use(expressSession({
    resave:false,
    saveUninitialized: false,
    secret: "secretkey"
}))

app.use(flash());


app.use("/", indexRouter)

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");  
})