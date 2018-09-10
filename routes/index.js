var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");


//home - welcome, signup
router.get("/", function(req, res){
   res.render("landing");
});


//================
//   Auth Routes
//================
//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle user signup
router.post("/register", function(req, res){
//    req.body.username
//    req.body.password
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        //log user in and redirect to secret page
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//login in route (form and logic)
//render login form
router.get("/login", function(req, res){
    res.render("login");
});

//login logic with middleware - runs before the callback
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//log out route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});


module.exports = router;