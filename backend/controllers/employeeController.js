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
            message:"New employee created succesfully"
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
        const page = parseInt(req.query.page) || 1;  // default page = 1
        const limit = parseInt(req.query.limit) || 20; // default limit = 20
        const skip = (page - 1) * limit;

        // Fetch total user count for pagination
        const total = await Employee.countDocuments();

        // Fetch paginated users
        const employees = await Employee.find()
        .skip(skip)
        .limit(limit)
        .populate('user','name companyEmail')
        .populate('department','name')
        .lean();

        if (!employees || employees.length === 0) {
        return res.status(404).json({
            message: 'No employees found',
            users: [],
            total: 0,
        });
        }

        res.status(200).json({
        message: 'Employees fetched successfully',
        employees,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        });
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
        const id = req.user.userId;
        const employee = await Employee.findOne({user:id})
        .populate('user','name companyEmail role')
        .populate('department','name');
        if(!employee){
            res.status(404).json({
                message:"Employee data not found.",
                data:[]
            })
        }
        res.status(200).json({
            message:"Employee fetched succesfully.",
            employee
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
            res.status(200).json({
                message:"Employee deleted successfully."
            })
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

exports.getUnlinkedEmployeeUsers = async (req, res) => {
  try {
    const employees = await Employee.find({}, 'user');
    const employeeUserIds = employees.map(e => e.user.toString());

    const unlinkedUsers = await User.find({
      role: 'Employee',
      _id: { $nin: employeeUserIds }
    }).select('name companyEmail role');

    res.status(200).json({ success: true, unlinkedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updateFields = {};
    if(req.user.role==='Employee'){
        const id=req.user.userId;
        const { personalEmail, contact } = req.body;
        if (personalEmail) updateFields.personalEmail = personalEmail;
        if (contact) updateFields.contact = contact;

        const updatedEmployee = await Employee.findOneAndUpdate(
            {user:id},
            { $set: updateFields },
            { new: true, runValidators: true }
        )
        .populate('user', 'name companyEmail role')
        .populate('department', 'name')
        .lean();

        if (!updatedEmployee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, employee: updatedEmployee });
    }
    else{
        const { idParam } = req.params;
        const id=idParam;
        const { personalEmail, department, contact, joining_date } = req.body;

        if (personalEmail) updateFields.personalEmail = personalEmail;
        if (department) updateFields.department = department;
        if (contact) updateFields.contact = contact;
        if (joining_date) updateFields.joining_date = joining_date;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        )
        .populate('user', 'name companyEmail role')
        .populate('department', 'name')
        .lean();

        if (!updatedEmployee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, employee: updatedEmployee });
    }
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};