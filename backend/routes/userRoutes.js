const router = require('express').Router();

const {login, logout, createUser, removeUser} = require('../controllers/userController')
const {auth,isHR,isAdmin,isEmployee} = require("../middlewares/authMiddleware");

router.post('/createUser',auth,isAdmin,createUser);
router.get('/removeUser/:id',auth,isAdmin,removeUser);
router.post('/login',login);
router.post('/logout',auth,logout);

module.exports = router