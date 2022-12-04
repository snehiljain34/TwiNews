//Basic NPM packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");


//NPM packages for authentication
require('dotenv').config();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//NPM packages for Newsletter
const request = require("request");
const https = require("https");


const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://SnehilJain34:RajEngineers345@cluster0.qitrw.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const categoryschema = new mongoose.Schema({
    id: String,
    headline: String,
    tweets: Array
});
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    bio: String,
    email: String,
    password: String
});

const user = mongoose.model("user", userSchema);
const business = mongoose.model("business", categoryschema);
const entertainment = mongoose.model("entertainment", categoryschema);
const health = mongoose.model("health", categoryschema);
const politics = mongoose.model("politics", categoryschema);
const sports = mongoose.model("sports", categoryschema);
const technology = mongoose.model("technology", categoryschema);


//authentication
const initializePassport = require('./passport-config');
const { head } = require("lodash");
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = [];
var choices = [];
var newBlogs;
var newDate = new Date();
newDate = newDate.toLocaleDateString();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/login', express.static('public'));
app.use('/register', express.static('public'));
app.use('/LoggedIN', express.static('public'));
app.use('/LoggedIN/news/', express.static('public'));
app.use('/LoggedIN/news/politics', express.static('public'));
app.use('/admin/links/', express.static('public'));
app.use('/landing', express.static('public'));


app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))





app.get("/", function(req, res) {
    res.render('landing');
})




app.get('/LoggedIN', checkAuthenticated, (req, res) => {
    res.render('Choices', { username: req.user.username })
})

app.post('/LoggedIN', checkAuthenticated, (req, res) => {
    try {
        choices.push({
            business: req.body.category1,
            entertainment: req.body.category2,
            health: req.body.category3,
            politics: req.body.category4,
            sports: req.body.category5,
            technology: req.body.category6,
        });
        console.log(choices);
        res.redirect('/LoggedIN/news')
    } catch (err) {
        console.log(err);
        res.redirect('/LoggedIN')
    }
})

app.get('/LoggedIN/news', checkAuthenticated, (req, res) => {
    choices = [{
        business: 'yes',
        entertainment: undefined,
        health: 'yes',
        politics: undefined,
        sports: undefined,
        technology: undefined
    }]
    var newBlogs = [];

    choices.forEach(function(choice) {

        if (choice.business == "yes") {

            politics.find({}, function(err, xyz) {
                if (err) {
                    console.log(err);
                } else {

                    res.render("feed", { Posts: xyz, date: newDate });
                }
            })


        }
    })
    console.log(newBlogs);


})

app.get('/LoggedIN/news/business', checkAuthenticated, (req, res) => {
    business.find({}, function(err, businesss) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: businesss, date: newDate }));
        }
    })

})

app.get('/LoggedIN/news/entertainment', checkAuthenticated, (req, res) => {
    entertainment.find({}, function(err, entertainments) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: entertainments, date: newDate }));
        }
    })

})
app.get('/LoggedIN/news/health', checkAuthenticated, (req, res) => {

    health.find({}, function(err, healths) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: healths, date: newDate }));
        }
    })

})

app.get('/LoggedIN/news/politics/', checkAuthenticated, (req, res) => {

    politics.find({}, function(err, politicss) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: politicss, date: newDate }));
        }
    })

})

app.get('/LoggedIN/news/sports', checkAuthenticated, (req, res) => {

    sports.find({}, function(err, sportss) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: sportss, date: newDate }));


        }
    })

})

app.get('/LoggedIN/news/technology', checkAuthenticated, (req, res) => {

    technology.find({}, function(err, technologys) {
        if (err) {
            console.log(err);
        } else {
            return (res.render("feednews", { Posts: technologys, date: newDate }));

        }
    })

})


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('Login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/LoggedIN',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('SignUp.ejs')
})

app.post('/register', checkNotAuthenticated, async(req, res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        console.log(users);
        res.redirect('/login')
    } catch (err) {
        console.log(err);
        res.redirect('/register')
    }
})


app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})





function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}



app.listen(3000, function() {
    console.log("Server stared on 3000");
});