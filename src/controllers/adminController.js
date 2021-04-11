const GroupModel = require('../models/Group');
const TeacherModel = require('../models/Teacher');
const fetch = require("node-fetch");
const events = require('events')

const emitter = new events.EventEmitter();

class adminController {
    async connectForLogging(req, res) {
        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        })
        emitter.on('scheduleChanged', (message) => {
            res.write(`data: ${JSON.stringify(message)} \n\n`)
        })

    }

    async updateTeachersDb(req, res) {
        try {
            const TEACHERS_API_URL = req.body["teachers_api_url"] || 'https://api.rozklad.org.ua/v2/teachers'
            writeScheduleToDB(TEACHERS_API_URL, TeacherModel, creatTeacherObject).catch(err => {
                throw  err
            })
            res.json({statusCode: 200, message: "Updating teachers database successfully started"});

        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async updateGroupsDb(req, res) {
        try {
            const GROUPS_API_URL = req.body["groups_api_url"] || 'https://api.rozklad.org.ua/v2/groups'
            writeScheduleToDB(GROUPS_API_URL, GroupModel, createGroupObject).catch(err => {
                throw  err
            })
            res.json({statusCode: 200, message: "Updating groups database successfully started"});
        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }

    async stopUpdatingDb(req, res) {
        try {
            emitter.emit('stopUpdating')
            res.json({statusCode: 200, message: "Updating stopped"});
        } catch (e) {
            console.log(e);
            res.status(500).json({statusCode: 500, message: "Server error occurred"})
        }
    }
}

function createGroupObject(jsonObj) {
    return {
        id: jsonObj["group_id"],
        name: jsonObj["group_full_name"],
        prefix: jsonObj["group_prefix"],
        okr: jsonObj["group_okr"],
        type: jsonObj["group_type"]
    }
}

function creatTeacherObject(jsonObj) {
    return {
        id: jsonObj["teacher_id"],
        name: jsonObj["teacher_name"],
        fullName: jsonObj["teacher_full_name"],
        shortName: jsonObj["teacher_short_name"],
    }
}

async function getListsFromApi(apiUrl, objectToCreate) {
    let objectsList = [];
    await fetch(apiUrl)
        // .then(checkStatus)
        .then(res => res.json())
        .then(json => json.meta["total_count"]) // getting count of groups
        .then(async function (count) {
            emitter.emit('scheduleChanged', {message:`There are ${count} objects`});
            const limit = Math.ceil(count / 100); // count of groups divided by 100 to get timetables 100 in one request

            for (let i = 0; i < limit; i++) {
                await fetch(apiUrl + `/?filter={'limit':100,'offset': ${i * 100}}`)
                    .then(res => res.json())
                    .then(json => json.data.map(jsonEl => {
                        const newObject = objectToCreate(jsonEl);
                        objectsList.push(newObject);
                    }))
            }
        })
    return objectsList;
}


async function writeScheduleToDB(apiUrl, model, objectToCreate) {
    getListsFromApi(apiUrl, objectToCreate).then(async elements => {
        await model.deleteMany({})
        let stop = false;
        emitter.on("stopUpdating", () => {
            stop = true;
            console.log('Updating db stopped')
        })
        for (let element of elements) {
            if (stop) break;
            await fetch(encodeURI(apiUrl + `/${element.id}/lessons`))
                .then(res => res.json())
                .then(async json => {
                    const newModelObj = new model(element);
                    newModelObj.lessons = (json.data) ? json.data : null;
                    await newModelObj.save();
                    const message =
                        {
                            message: (json.data) ? `${element.id} - ${element.name} => schedule successfully added` :
                                `${element.id} - ${element.name} => schedule is null`
                        };
                    console.log(message.message)

                    emitter.emit('scheduleChanged', message)
                })
        }
    })
}




module.exports = new adminController()