const Attendance = require('../models/attendanceModel')

exports.markAttendance=async(req,res)=>{
    try{
        const {employeeId,status} = req.body;

        await Attendance.findOneAndUpdate(
            {employee:employeeId,date:new Date().toISOString().split("T")[0]},
            {employee:employeeId,date:new Date().toISOString().split("T")[0],status}
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