if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express(); 
const mongoose = require('mongoose');
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const expressError = require("./utlits/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/users.js");
const dburl = process.env.ATLASDB_URL;
 


//routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")




main().then(()=>{
    console.log("connecter to db")
}).catch((err)=>{
    console.log(err)
});

async function main() {
  await mongoose.connect(dburl);
}

app.set('views', path.join(__dirname,'views'));
app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret :  process.env.SECRET,
    },
    touchAfter :  24 * 3600,
});

store.on("error",()=>{
    console.log("error in MONGEO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

//passport authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});
 
// Express Routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

 

 
 

//error handeling
app.all("*",(req,res,next)=>{
    next(new expressError(404,"page is not found"))
})

app.use((err,req,res,next)=>{
    let {statusCode,message} = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

 
app.listen("8080",(req,res)=>{
    console.log("the server is running");
});