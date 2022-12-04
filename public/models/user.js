const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://SnehilJain34:RajEngineers345@cluster0.qitrw.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    headline: String,
    Category: String,
    date: String,
});

// plugin for passport-local-mongoose
UserSchema.plugin(passportLocalMongoose);

// export userschema
module.exports = mongoose.model("Users", UserSchema);