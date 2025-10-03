const express = require('express');
const { isEmployee } = require('../middlewares/authMiddleware');
const { markAttendance } = require('../controllers/attendanceController');
const router = express.Router();

router.get('/markAttendance',isEmployee,markAttendance)

module.exports = router;