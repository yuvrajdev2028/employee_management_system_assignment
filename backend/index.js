const express = require('express');
const dbConnect = require('./config/databaseConfig');
require('dotenv').config();

const app = express();

PORT = process.env.PORT|5000;

app.get("/",(req,res)=>{
    res.send("<h2>Server started...</h2>")
})

dbConnect();

app.listen(PORT,(err)=>{
    if(err) console.error(`Error occured while starting the server at port ${PORT}:`,err);
    else console.log(`Server listening to port ${PORT}`);
})