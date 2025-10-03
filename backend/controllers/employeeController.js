const { compare } = require('bcrypt');
const Employee = require('../models/employeeModel');
const { comparePassword } = require('../utils/hashUtils');
const { generateAccessToken } = require('../utils/tokenUtils');

exports.createEmployee = async(req,res)=>{
    try{
        const {name,personalEmail,department,joining_date,contact}=req.body;
        const newEmployee = new Employee({name,personalEmail,department,joining_date,contact});
        await newEmployee.save();
        res.status(200).json({
            message:"new employee created succesfully"
        })
    }
    catch(error){
        console.log("Error occured while creating Employee: ",error);
        req.status(500).json({
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