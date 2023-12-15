const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
var app = express()

// console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(()=>console.log('db connected'));


app.get('/',(req,res)=>{
    res.json('test')
})

app.post('/register',(req,res)=>{

})

app.listen(4000)