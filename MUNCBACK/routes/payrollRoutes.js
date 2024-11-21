const express = require('express');
const { generatePayroll, getEmployeePayroll } = require('../controllers/payrollController');

const router = express.Router();

// Route to generate payroll
router.get('/generatePayroll', generatePayroll);

// Route to fetch payroll for a specific employee
router.get('/employeePayroll', getEmployeePayroll);

module.exports = router;
