const { compare } = require('bcrypt');
const Employee = require('../models/employeeModel');
const { comparePassword } = require('../utils/hashUtils');
const { generateAccessToken } = require('../utils/tokenUtils');
const User = require('../models/userModel');

exports.createEmployee = async(req,res)=>{
    try{
        const {personalEmail,department,joining_date,contact,user}=req.body;
        const newEmployee = new Employee({personalEmail,department,joining_date,contact,user});
        await newEmployee.save();
        res.status(200).json({
            message:"new employee created succesfully"
        })
    }
    catch(error){
        console.log("Error occured while creating Employee: ",error);
        res.status(500).json({
            message:"Error occured while creating Employee"
        })
    }
}

exports.getEmployees=async(req,res)=>{
    try{
        const employees = await Employee.find();
        if(!employees){
            res.status(200).json({
                message:"No employees exist.",
                data:[]
            })
        }
        res.status(200).json({
            message:"Employees fetched succesfully.",
            data:employees
        })

    }
    catch(error){
        console.log("Error occured while fetching the employees:",error)
        res.status(500).json({
            message:"Error occured while fetching the employees."
        })
    }
}

exports.getEmployee=async(req,res)=>{
    try{
        const id = req.params.id;
        const employees = await Employee.find({_id:id});
        if(!employees){
            res.status(200).json({
                message:"No employee exist.",
                data:[]
            })
        }
        res.status(200).json({
            message:"Employee fetched succesfully.",
            data:employees
        })

    }
    catch(error){
        console.log("Error occured while fetching the employees:",error)
        res.status(500).json({
            message:"Error occured while fetching the employees."
        })
    }
}

exports.removeEmployee=async(req,res)=>{
    try{
        const id = req.params.id;
        const employee = await Employee.findOne({_id:id})
        if(!employee){
            res.status(404).json({
                message:"Employee with given id does not exist."
            })
        }
        const user = await User.findOne({_id:employee.user})
        if(!user){
            throw new Error("Could not find user for this employee.")
        }
        if((user.role==="Employee" && (req.user.role==='HR'||req.user.role==='Admin')) || (user.role==="HR" && req.user.role==='Admin')){
            await User.deleteOne({_id:user.id})
            await Employee.deleteOne({_id:id})
        }
        else{
            res.status(403).json({
                message:"This user is not allowed to remove this employee"
            })
        }
    }
    catch(error){
        console.log("Error occured while removing the employee:",error)
        res.status(500).json({
            message:"Error occured while removing the employee."
        })
    }
}