const Groups = require('../models/Group');
const Teacher = require('../models/Teacher');
const jsonProcessing = require('../jsonProcessing')


class scheduleController {
    async getGroups(req, res) {
        try {
            const projection = {_id: 0, __v: 0, lessons: 0};
            const queryFilterParams = req.query;
            const limit = parseInt(queryFilterParams.limit, 10) || 500;
            const offset = parseInt(queryFilterParams.offset, 10) || 0;

            const groupsList = await Groups.find({}, projection).limit(limit).skip(offset);

            if (!groupsList) {
                return res.status(404).json({statusCode: 404, message: "Groups not found or db is empty"});
            }
            return res.status(200).json(groupsList)
        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async getGroupLessons(req, res) {
        try {
            const query = {$or: [{id: parseInt(req.params["group"], 10)}, {name: req.params["group"]}]};
            const projection = {_id: 0, __v: 0};
            const group = await Groups.findOne(query, projection);

            if (!group) {
                return res.status(404).json({statusCode: 404, message: "Group not found"});
            }
            return res.status(200).json({
                id: group["id"],
                name: group["name"],
                prefix: group["prefix"],
                okr: group["okr"],
                type: group["type"],
                lessons: group["lessons"]
            })

        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async getGroupTimetable(req, res) {
        try {
            const query = {$or: [{id: parseInt(req.params["group"], 10)}, {name: req.params["group"]}]};
            const projection = {_id: 0, __v: 0};
            const group = await Groups.findOne(query, projection);
            if (!group) {
                return res.status(404).json({statusCode: 404, message: "Group not found"});
            }

            const groupData = {
                id: group["id"],
                name: group["name"],
                prefix: group["prefix"],
                okr: group["okr"],
                type: group["type"],
            };
            const timetable = jsonProcessing.createTimetable(group["lessons"])
            res.status(200).json(Object.assign(groupData, timetable))


        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async getTeachers(req, res) {
        try {
            const projection = {_id: 0, __v: 0, lessons: 0};
            const queryFilterParams = req.query;
            const limit = parseInt(queryFilterParams.limit, 10) || 500;
            const offset = parseInt(queryFilterParams.offset, 10) || 0;
            const teachersList = await Teacher.find({}, projection).limit(limit).skip(offset);

            if (!teachersList) {
                return res.status(404).json({statusCode: 404, message: "Teachers not found or db is empty"});
            }
            return res.status(200).json(teachersList)
        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async getTeacherLessons(req, res) {
        try {
            const query = {$or: [{id: parseInt(req.params["teacher"], 10)}, {name: req.params["teacher"]}]}; // dont forget to change id value to int
            const projection = {_id: 0, __v: 0};
            const teacher = await Teacher.findOne(query, projection);

            if (!teacher) {
                return res.status(404).json({statusCode: 404, message: "Teacher not found"});
            }
            return res.status(200).json({
                id: teacher["id"],
                name: teacher["name"],
                fullName: teacher["fullName"],
                shortName: teacher["shortName"],
                lessons: teacher["lessons"]
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async getTeacherTimetable(req, res) {
        try {
            const query = {$or: [{id: req.params["teacher"]}, {name: req.params["teacher"]}]};
            const projection = {_id: 0, __v: 0};
            const teacher = await Teacher.findOne(query, projection);
            if (!teacher) {
                return res.status(404).json({statusCode: 404, message: "Teacher not found"});
            }

            const teacherData = {
                id: teacher["id"],
                name: teacher["name"],
                fullName: teacher["fullName"],
                shortName: teacher["shortName"],
            };
            const timetable = jsonProcessing.createTimetable(teacher["lessons"])
            res.status(200).json(Object.assign(teacherData, timetable))

        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

}

module.exports = new scheduleController()