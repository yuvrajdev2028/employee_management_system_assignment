const Employee = require('../models/employeeModel');
const Attendance = require('../models/attendanceModel');

exports.populateAttendance=async()=>{
    try{
        const employees = await Employee.find();
        if(!employees) throw new Error("Unable to fetch employees for initializing attendance")
        employees.forEach(async(employee)=>{
            await Attendance.findOneAndUpdate(
                { employee: employee._id, date: new Date().toISOString().split("T")[0] },
                { employee: employee._id, date: new Date().toISOString().split("T")[0], status: "Absent" },
                { new: true, upsert: true } 
            );
        })
    }
    catch(error){
        console.log("Error occured while initializing daily attendance:",error)
    }
}