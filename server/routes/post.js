const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const { post } = require('./authen');
const Post = mongoose.model('Post')

router.get("/allpost",(req,res)=>{
    Post.find()
    .populate("postedby")
    .then(posts=>{
        res.json(posts)
    }).catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body;
    if(!title||!body){
        return res.status(422).json({error:"please add sll of the fields"});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        postedby:req.user
    })
    post.save().then(result=>{
        res.json({json:result})
    }).catch(err=>{
        console.log(err);
    })
})
router.get("/mypost",requireLogin,(req,res)=>{

    Post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})
module.exports = router