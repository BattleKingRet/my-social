const express = require('express');
const app = express()
const mongoose = require('mongoose');
const PORT = 5000
const{MONGOURI} = require('./valuekeys.js');



mongoose.connect(MONGOURI,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.connection.on('connected', ()=>{
    console.log(("We are connected to mongodb"));
})
mongoose.connection.on('error', ()=>{
    console.log(("We are NOTTTT!!!!! connected to mongodb"));
})

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/authen'))
app.use(require('./routes/post'))

const customMiddleware = (req,res,next) =>{
    console.log("middleware");
    next()
}


app.listen(PORT,()=>{
    console.log("Server is running at",PORT)
})