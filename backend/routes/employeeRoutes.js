const express = require('express');
const router = express.Router();

const {getEmployees, createEmployee, removeEmployee, getEmployee, getUnlinkedEmployeeUsers, updateEmployee}=require('../controllers/employeeController');
const { isHR, isNotEmployee, auth, isEmployee } = require('../middlewares/authMiddleware');

router.post('/createEmployee',auth,isHR,createEmployee)
router.get('/getEmployees',auth,isHR,getEmployees)
// router.get('/employee/:id',auth,getEmployee)
router.delete('/removeEmployee/:id',auth,isNotEmployee,removeEmployee)
router.get('/unlinkedUsers',auth,isHR, getUnlinkedEmployeeUsers);
router.put('/updateEmployee/:id', auth, isHR, updateEmployee);

//routes only for employees
router.get('/getMyDetails',auth,isEmployee,getEmployee)
router.put('/updateMyDetails',auth,isEmployee,updateEmployee)

module.exports = router