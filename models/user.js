var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

//schema setup

var userSchema = new mongoose.Schema({
    username: String,
    password: String
//    name: String,
//    image: String,
//    description: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);