const router = require('express').Router();

const { auth, isHR } = require('../middlewares/authMiddleware');
const {createDepartment} = require('../controllers/departmentController')

router.post('/createDepartment',auth,isHR,createDepartment);

module.exports = router;