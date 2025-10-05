const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
// const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

exports.createUser = async(req,res)=>{
    try{
        const { name, companyEmail, password, role} = req.body;
        const hashedPassword = await hashPassword(password);
        if(!hashedPassword) throw new Error("Password not hashed");
        const newUser = new User({name,companyEmail,password:hashedPassword,role});
        await newUser.save();
        res.status(200).json({
            message:"New user created successfully."
        })
    }
    catch(error){
        console.log("Error occured while creating user: ", error);
        res.status(500).json({
            message:"Error occured while creating user."
        })
    }
}

exports.removeUser=async(req,res)=>{
    try{
        const id = req.params.id;
        if(!id) throw new Error("ID not found.");
        await User.deleteOne({_id:id});
        res.status(200).json({
            message:"User removed successfully."
        })
    }
    catch(error){
        console.log("Error occured while removing user:",error)
        res.status(500).json({
            message:"Error occured on server while removing user."
        })
    }
}

exports.login = async(req,res)=>{
    try{
        // console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({companyEmail: email});
        if(!user){
            return res.status(401).json({
                message: 'Invalid Email',
            })
        }
        const isValid = await comparePassword(password,user.password);
        if(!isValid){
            return res.status(401).json({
                message: 'Invalid Password',
            })
        }
        // Generate Access Token
        const accessToken = generateAccessToken({userId: user._id,role: user.role,name: user.name});

        // Generate Refresh Token
        const refreshToken = generateRefreshToken({userId: user._id,role: user.role,name: user.name});

        if(!accessToken || !refreshToken){
            throw new Error("Error occured while generating tokens.")
        }

        //Set refresh token as a httponly cookie
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
            })
            .status(200)
            .json({ // Send Access Token in response body
            accessToken: accessToken,
            message: 'Log In Successful.'
        })
    }
    catch(error)
    {
        console.log("Error occured while logging in:",error)
        res.status(500).json({
            message:"Error occured on server while logging in."
        })
    }
}

exports.logout = async(req,res)=>{
    try{
        res.clearCookie('refreshToken',{
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        return res.status(200).json({
            message: 'Logged Out Successfully!',
        })
    }
    catch(error)
    {
        console.log("Error occured while logging out:",error)
        res.status(500).json({
            message:"Error occured on server while logging out."
        })
    }
}

//get user data
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // default page = 1
    const limit = parseInt(req.query.limit) || 20; // default limit = 20
    const skip = (page - 1) * limit;

    // Fetch total user count for pagination
    const total = await User.countDocuments();

    // Fetch paginated users
    const users = await User.find({ role: { $ne: 'Admin' } }, 'name companyEmail role')
      .skip(skip)
      .limit(limit)
      .lean();

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
        users: [],
        total: 0,
      });
    }

    res.status(200).json({
      message: 'Users fetched successfully',
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error occurred while fetching users:', error);
    res.status(500).json({
      message: 'Error occurred on server while fetching users.',
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Extract fields to update (only allow specific fields)
    const { name, companyEmail, password, role } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (companyEmail) updateFields.companyEmail = companyEmail;
    if (role) updateFields.role = role;
    if (password){
        let hashedPassword = await hashPassword(password);
        if(!hashedPassword) throw new Error("Error occured while hashing updated password.")
        updateFields.password=hashedPassword;
    }

    // Update user and return new document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true, lean: true }
    ).select('name companyEmail role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Error occurred while updating user on the server',
    });
  }
};
