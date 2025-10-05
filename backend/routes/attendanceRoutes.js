const express = require('express');
const { isEmployee, auth } = require('../middlewares/authMiddleware');
const { markAttendance, getAttendance } = require('../controllers/attendanceController');
const router = express.Router();

router.get('/markAttendance',auth,isEmployee,markAttendance)
router.get('/getAttendance',auth,isEmployee,getAttendance)

module.exports = router;