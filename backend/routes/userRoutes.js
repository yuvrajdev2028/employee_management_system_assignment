const router = require('express').Router();

const {login, logout, createUser, removeUser,getUsers} = require('../controllers/userController')
const {auth,isHR,isAdmin,isEmployee} = require("../middlewares/authMiddleware");

router.post('/createUser',auth,isAdmin,createUser);
router.get('/removeUser/:id',auth,isAdmin,removeUser);
router.post('/login',login);
router.post('/logout',auth,logout);
router.get('/getUsers',auth,isAdmin,getUsers);

module.exports = router