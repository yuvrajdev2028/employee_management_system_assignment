const router = require('express').Router();

const {login, logout, createUser, removeUser} = require('../controllers/userController')

router.post('/createUser',createUser);
router.get('/removeUser',removeUser);
router.post('/login',login);
router.get('/logout',logout);

module.exports = router