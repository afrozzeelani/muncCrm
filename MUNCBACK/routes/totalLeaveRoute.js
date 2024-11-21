const express = require("express");
const {assignLeave,getAllAvailableLeave,getAvailableLeave,deductLeave,rejectedLeave,getAvailableLeaveByEmail} = require('../controllers/totalLeave');
const totalLeaveRoute = express.Router();
const {verifyAdminHRManager,verifyAdminHR,verifyAdmin,verifyAll, verifyHR} = require('../middleware/rbacMiddleware');
// POST route to assign leave
totalLeaveRoute.post('/assignLeave',verifyAdminHR,assignLeave);
totalLeaveRoute.post('/getLeave',verifyAll, getAvailableLeave);
totalLeaveRoute.get('/getAllLeave',verifyAdminHR, getAllAvailableLeave);
totalLeaveRoute.post('/deductLeave',verifyAll,deductLeave);
totalLeaveRoute.post('/rejectedLeave',verifyAll,rejectedLeave);
totalLeaveRoute.post('/particularLeave',verifyAll,getAvailableLeaveByEmail);

module.exports = { totalLeaveRoute };