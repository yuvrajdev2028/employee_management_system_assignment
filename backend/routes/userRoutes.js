const router = require('express').Router();

const {login, logout, createUser, removeUser,getUsers,updateUser} = require('../controllers/userController')
const {auth,isHR,isAdmin,isEmployee} = require("../middlewares/authMiddleware");

router.post('/createUser',auth,isAdmin,createUser);
router.delete('/removeUser/:id',auth,isAdmin,removeUser);
router.post('/login',login);
router.post('/logout',auth,logout);
router.get('/getUsers',auth,isAdmin,getUsers);
router.put('/updateUser/:id', auth, isAdmin, updateUser);

module.exports = router