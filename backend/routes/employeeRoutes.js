const express = require('express');
const router = express.Router();

const {getEmployees, createEmployee, removeEmployee, getEmployee}=require('../controllers/employeeController');
const { isHR, isNotEmployee, auth } = require('../middlewares/authMiddleware');

router.post('/createEmployee',auth,isHR,createEmployee)
router.get('/employees',auth,isHR,getEmployees)
router.get('/employee/:id',auth,getEmployee)
router.get('/removeEmployee/:id',auth,isNotEmployee,removeEmployee)

module.exports = router