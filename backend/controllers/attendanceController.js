const Attendance = require('../models/attendanceModel');
const Employee = require('../models/employeeModel');

exports.markAttendance=async(req,res)=>{
    try{
        const userId = req.user.userId;
        const employee =  await Employee.findOne({user:userId})
        if(!employee) throw new Error("Unable to fetch employee");

        await Attendance.findOneAndUpdate(
            {employee:employee._id,date:new Date().toISOString().split("T")[0]},
            {employee:employee._id,date:new Date().toISOString().split("T")[0],status:"Present"},
            {upsert:true}
        )

        res.status(200).json({
            message:"Attendance marked successfully"
        })
    }
    catch(error){
        console.log("Error occured while marking attendance:",error)
        res.status(500).json({
            message:"Error occured while marking attendance."
        })
    }
}

exports.getAttendance=async(req,res)=>{
    try{
        const userId = req.user.userId;
        const employee =  await Employee.findOne({user:userId})
        if(!employee) throw new Error("Unable to fetch employee");
        const todayAttendance = await Attendance.findOne({employee:employee._id,date:new Date().toISOString().split("T")[0]})
        if(!todayAttendance) throw new Error("Unable to fetch today's attendance");
        res.status(200).json({
            message:"Attendance fetched succesfully.",
            todayStatus:todayAttendance.status
        })
    }
    catch(error){
        console.log("Error occured while fetching attendance:",error)
        res.status(500).json({
            message:"Error occured while fetching attendance."
        })
    }
}