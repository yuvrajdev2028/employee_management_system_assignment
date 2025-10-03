const mongoose = require('mongoose');
require('dotenv').config();

const { populateAttendance } = require('../utils/attendanceUtils')


const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connection to database successful.");
        populateAttendance();
    })
    .catch((err)=>{
        console.error("Error occured while connecting to database:",err);
        process.exit(1);
    })
} 

module.exports = dbConnect