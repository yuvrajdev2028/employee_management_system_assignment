const express = require('express');

const app = express();

PORT = 4000;

app.get("/",(req,res)=>{
    res.send("<h2>Server started...</h2>")
})

app.listen(PORT,(err)=>{
    if(err) console.error(`Error occured while starting the server at port ${PORT}:`,err);
    else console.log(`Server listening to port ${PORT}`);
})