const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    companyEmail:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["HR","Employee","Admin"]
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

module.exports = User;