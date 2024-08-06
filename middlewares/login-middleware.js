const jwt = require("jsonwebtoken");
 function isLoggedIn(req, res, next){
    if(req.cookies.token){
        jwt.verify(req.cookies.token, process.env.JWT_SECRET, function(err, decoded){
            if(err){
                res.redirect("/");
            } else {
                req.user = decoded;
                next();
            }
        })
    }else{
        res.redirect("/");
    }
}

module.exports = isLoggedIn;

