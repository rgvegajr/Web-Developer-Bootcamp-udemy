var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
//campgrounds - name, image
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }  else  {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//CREATE - create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campground array
   // res.send("you hit the post route");
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, price: price, image: image, description: description, author: author};
    //create new campground and add to DB
 //add username and id to comment
            // comment.author.id = req.user._id;
            // comment.author.username = req.user.username;
            // //save
            // comment.save();

    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        }  else  {
            req.flash("success", "New Campground Added!");
            res.redirect("campgrounds");
        }
    });
});

//NEW - show new campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
    
});

//SHOW
router.get("/:id", function(req, res){
    //show additional campground info page
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found.");
            res.redirect("back");
        }  else  {
//            console.log(foundCampground);
            //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//edit campground route (show form)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
                    res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route (update via PUT)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }  else  {
            req.flash("success", "Campground Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }  else  {
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});


//middleware moved to middleware/index.js

module.exports = router;