const Department = require('../models/departmentModel')

exports.createDepartment = async(req,res)=>{
    try{
        const {name} = req.body;
        const newDepartment = new Department({name:name});
        await newDepartment.save();
        res.status(200).json({
            message:"Department created successfully."
        })
    }
    catch(error){
        console.log("Error occured while creating department:",error);
        res.status(500).json({
            message:"Error occured while creating department."
        })
    }
}

exports.getDepartments = async(req,res)=>{
    try{
        const departments = await Department.find();
        res.status(200).json({
            departments,
            message:"Departments fetched successfully."
        })
    }
    catch(error)
    {
        console.log("Error occured while fetching departments:",error);
        res.status(500).json({
            message:"Error occured while fetching departments."
        })
    }
}
