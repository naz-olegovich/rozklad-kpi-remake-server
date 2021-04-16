'use strict';
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/groups', scheduleController.getGroups);
router.get('/groups/:group/lessons', scheduleController.getGroupLessons);
router.get('/groups/:group/timetable', scheduleController.getGroupTimetable);

router.get('/teachers', scheduleController.getTeachers);
router.get('/teachers/:teacher/lessons', scheduleController.getTeacherLessons);
router.get('/teachers/:teacher/timetable', scheduleController.getTeacherTimetable);

module.exports = router;
