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
        const { email, password } = req.body;
        const user = await User.findOne({companyEmail: email});
        const isValid = await comparePassword(password,user.password);
        if(!user || !isValid){
            return res.status(401).json({
                message: 'Invalid Email or Password',
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
