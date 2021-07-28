const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../valuekeys');
const requireLogin = require('../middleware/requireLogin')

router.get("/",(req,res)=>{
    res.send("hello world")
})
router.post("/signup",(req,res)=>{

    const {name,email,password} = req.body
    if(!email || !password || !name){
        res.status(422).json({error:"You need to provide all the information"});
    }
    User.findOne({email:email}).then((savedUser=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists"});
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
    
            })
            user.save()
                .then(user=>{
                    res.json({message:"saved successfully"})
                }).catch(err=>{
                    console.log(err);
                })
        })
        
    })).catch(err=>{
        console.log(err);
    })
    //res.json({message:"Your data is successfully sent"})

    console.log(req.body.name);
})

router.get("/protected",requireLogin,(req,res)=>{
    res.send("hello user");
})


router.post("/signin",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please enter email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                res.json({token})
                //res.json({message:"Successfully signed in"})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router