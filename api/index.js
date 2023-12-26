const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/Users");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var bcrypt = require('bcryptjs');
var bcryptSalt = bcrypt.genSaltSync(10);
const ws = require('ws')

var app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
// console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(() => console.log("db connected"));
const jwtSecret = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.json("test");
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userDoc) => {
      if (err) throw err;
      res.json(userDoc);
    });
  } else {
    res.json("no token").status(401);
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password:bcrypt.hashSync(password,bcryptSalt) });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token ,{sameSite:'none', secure:true}).status(201).json({
          id: createdUser._id,username
        });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.post("/login",async (req,res)=>{
  
  const { username, password } = req.body;
  const foundUser = await User.findOne({username});
  if(foundUser){
    const passOK = bcrypt.compareSync(password,foundUser.password)
    if(passOK){
      jwt.sign(
        { userId: foundUser._id , username:foundUser.username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token ,{sameSite:'none', secure:true}).status(201).json({
            id: foundUser._id,username
          });
        }
      );
    }
  }
})

const server = app.listen(4000);
const wss = new ws.WebSocketServer({server})
wss.on("connection",(connection , req)=>{
  connection.send('hello')
  const cookies = req.headers.cookie;
  if(cookies){
    const tokenCookieString= req.headers.cookie.split(';').find(str=>str.startsWith(' token=') || str.startsWith('token='))
    const token =tokenCookieString.split('=')[1]
    if(token){
      jwt.verify(token,jwtSecret,{},(err,userDoc)=>{
        if(err) throw err
        const {userId,username} = userDoc
        connection.userId=userId
        connection.username=username
      })
    }
  }
 
[...wss.clients].forEach(client =>{
  client.send(JSON.stringify({
    online:[...wss.clients].map(c=>({userId:c.userId,username:c.username}))
  }))
})
  

})

  