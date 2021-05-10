'use strict';
const Groups = require('../models/Group');
const Teacher = require('../models/Teacher');
const jsonProcessing = require('../jsonProcessing');

/** Клас-контролер маршрутів розкладу */
class ScheduleController {
    /**
     * Повертає список усіх груп (з обмеженням 500 за замовчуванням)
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список груп
     */
    async getGroups(req, res) {
        try {
            const projection = { _id: 0, __v: 0, lessons: 0 };
            const queryFilterParams = req.query;
            const limit = parseInt(queryFilterParams.limit, 10) || 500;
            const offset = parseInt(queryFilterParams.offset, 10) || 0;
            const groupsList = await Groups.find({}, projection).limit(limit).skip(offset);

            if (!groupsList) {
                return res.status(404).json({ statusCode: 404, message: 'Groups not found or db is empty' });
            }
            return res.status(200).json(groupsList);
        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e;
        }
    }

    /**
     * Повертає список занять для конкретної групи
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список занять
     */
    async getGroupLessons(req, res) {
        try {
            const query = { $or: [{ id: parseInt(req.params['group'], 10) }, { name: req.params['group'] }] };
            const projection = { _id: 0, __v: 0 };
            const group = await Groups.findOne(query, projection);

            if (!group) {
                return res.status(404).json({ statusCode: 404, message: 'Group not found' });
            }
            const { id, name, prefix, okr, type, lessons } = group;
            return res.status(200).json({ id, name, prefix, okr, type, lessons });

        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e;
        }
    }

    /**
     * Повертає ієрархічно впорядкований розклад для конкретної групи
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список занять
     */
    async getGroupTimetable(req, res) {
        try {
            const query = { $or: [{ id: parseInt(req.params['group'], 10) }, { name: req.params['group'] }] };
            const projection = { _id: 0, __v: 0 };
            const group = await Groups.findOne(query, projection);

            if (!group) {
                return res.status(404).json({ statusCode: 404, message: 'Group not found' });
            }
            const { id, name, prefix, okr, type, lessons } = group;
            const { weeks } = jsonProcessing.createTimetable(lessons);
            res.status(200).json({ id, name, prefix, okr, type, weeks });


        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e;
        }
    }

    /**
     * Повертає список усіх викладачів (з обмеженням 500 за замовчуванням)
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список груп
     */
    async getTeachers(req, res) {
        try {
            const projection = { _id: 0, __v: 0, lessons: 0 };
            const queryFilterParams = req.query;
            const limit = parseInt(queryFilterParams.limit, 10) || 500;
            const offset = parseInt(queryFilterParams.offset, 10) || 0;
            const teachersList = await Teacher.find({}, projection).limit(limit).skip(offset);

            if (!teachersList) {
                return res.status(404).json({ statusCode: 404, message: 'Teachers not found or db is empty' });
            }
            return res.status(200).json(teachersList);
        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e;
        }
    }

    /**
     * Повертає список занять для конкретного виклада
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список занять
     */
    async getTeacherLessons(req, res) {
        try {
            const query = { $or: [{ id: parseInt(req.params['teacher'], 10) }, { name: req.params['teacher'] }] };
            const projection = { _id: 0, __v: 0 };
            const teacher = await Teacher.findOne(query, projection);

            if (!teacher) {
                return res.status(404).json({ statusCode: 404, message: 'Teacher not found' });
            }
            const { id, name, fullName, shortName, lessons } = teacher;
            return res.status(200).json({ id, name, fullName, shortName, lessons });

        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e;
        }
    }

    /**
     * Повертає ієрархічно впорядкований розклад для конкретного викладача
     *
     * @param {Object} req - об'єкт Express запиту
     * @param {Object} res - об'єкт Express відповіді
     * @return {json} response - Список занять
     */
    async getTeacherTimetable(req, res) {
        try {
            const query = { $or: [{ id: req.params['teacher'] }, { name: req.params['teacher'] }] };
            const projection = { _id: 0, __v: 0 };
            const teacher = await Teacher.findOne(query, projection);
            if (!teacher) {
                return res.status(404).json({ statusCode: 404, message: 'Teacher not found' });
            }
            const { id, name, fullName, shortName, lessons } = teacher;
            const { weeks } = jsonProcessing.createTimetable(lessons);
            res.status(200).json({ id, name, fullName, shortName, weeks });

        } catch (e) {
            res.status(500).json({ statusCode: 500, message: 'Server error occurred' });
            throw e
        }
    }

}

module.exports = new ScheduleController();
