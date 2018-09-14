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

// //CREATE - create new campground
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to campground array
//   // res.send("you hit the post route");
//     var name = req.body.name;
//     var price = req.body.price;
//     var image = req.body.image;
//     var description = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newCamp = {name: name, price: price, image: image, description: description, author: author};
//     //create new campground and add to DB
//  //add username and id to comment
//             // comment.author.id = req.user._id;
//             // comment.author.username = req.user.username;
//             // //save
//             // comment.save();

//     Campground.create(newCamp, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         }  else  {
//             req.flash("success", "New Campground Added!");
//             res.redirect("campgrounds");
//         }
//     });
// });

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCamp = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
             req.flash("success", "New Campground Added!");
            res.redirect("/campgrounds");
        }
    });
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

// //update campground route (update via PUT)
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
// //find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if(err){
//             res.redirect("/campgrounds");
//         }  else  {
//             req.flash("success", "Campground Updated!");
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// });

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});




//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
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
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

module.exports = router;