const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utlits/wrapAsync.js");
const passport = require("passport");


//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username})
        const registereduser = await User.register(newUser,password);
        req.login(registereduser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","welcome to wonderlust");
            res.redirect("/listings")
        })
       
    }catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
})
);

//login

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",
passport.authenticate("local",{failureRedirect:'/login',failureFlash : true}),
async(req,res)=>{
    req.flash("success","welcome to wonderlust!");
    res.redirect("/listings")
})

//logout

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logout successfully")
        res.redirect("/listings")
    })
})


module.exports = router;