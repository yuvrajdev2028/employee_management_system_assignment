const jwt = require('jsonwebtoken');

exports.auth = (req,res,next) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({
                message: 'Token Not Found!',
            })
        }
        try{
            req.user = jwt.verify(token,process.env.JWT_SECRET);
        }
        catch(error){
            return res.status(401).json({
                message: 'Invalid Token',
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            message: 'Authentication failed.',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                message: 'Only Admins can access this route.',
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            message: 'Authorization failed while accessing protected route for Admins.',
        })
    }
}

exports.isHR = (req,res,next) => {
    try{
        if(req.user.role!=='HR'){
            return res.status(401).json({
                message: 'Only HRs can access this route.',
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            message: 'Authorization failed while accessing protected route for HRs.',
        })
    }
}

exports.isEmployee = (req,res,next) => {
    try{
        if(req.user.role !== 'Employee'){
            return res.status(401).json({
                message: 'Only Employees can access this route.',
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            message: 'Authorization failed while accessing protected route for Employees.',
        })
    }
}