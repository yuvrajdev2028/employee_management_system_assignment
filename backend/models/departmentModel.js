const mongoose = require('mongoose')

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true })

const Department = mongoose.model("Department",departmentSchema);

modeule.exports = Department;