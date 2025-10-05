const router = require('express').Router();

const { auth, isHR } = require('../middlewares/authMiddleware');
const {createDepartment, getDepartments} = require('../controllers/departmentController')

router.post('/createDepartment',auth,isHR,createDepartment);
router.get('/getDepartments',auth,getDepartments)

module.exports = router;