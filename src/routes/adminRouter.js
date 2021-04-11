const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/connect-for-logging', adminController.connectForLogging);
router.post('/update-teachers', adminController.updateTeachersDb);
router.post('/update-groups', adminController.updateGroupsDb);
router.post('/stop-updating', adminController.stopUpdatingDb);


module.exports = router;