const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    personalEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },
    joining_date: {
        type: Date,
        required: true
    },
    contact:{
        type:Number,
        required: true,
    }
},{timestamps:true});

const Employee = mongoose.model("Employee",employeeSchema)

module.exports = Employee