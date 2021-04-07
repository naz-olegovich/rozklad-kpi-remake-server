const fetch = require("node-fetch");
// const MongoClient = require("mongodb").MongoClient;
const config = require("../config");
const mongoose = require('mongoose');
const Group = require('./models/Group');
const Teachers = require('./models/Teacher');


function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw Error(res.statusText);
    }
}

function showLogMessage(type, message) {
    const warningColor = '\x1b[1;33m';
    const infoColor = '\x1b[0m';

    if (type === 'warning') {
        console.log(warningColor + message);
    } else if (type === 'info') {
        console.log(infoColor + message);
    }
}

async function getGroups() {
    let groups = [];
    await fetch("http://api.rozklad.org.ua/v2/groups/")
        .then(checkStatus)
        .then(res => res.json())
        .then(json => json.meta.total_count) // getting count of groups
        .then(async function (count) {
            showLogMessage("info", `There are ${count} groups`);
            const limit = Math.ceil(count / 100); // count of groups divided by 100 to get timetables 100 in one request

            for (let i = 0; i < limit; i++) {
                await fetch(`http://api.rozklad.org.ua/v2/groups/?filter={'limit':100,'offset': ${i * 100}}`)
                    .then(res => res.json())
                    .then(json => json.data.map(obj => {
                        const group = {
                            id: obj.group_id,
                            name: obj.group_full_name,
                            prefix: obj.group_prefix,
                            okr: obj.group_okr,
                            type: obj.group_type
                        };
                        groups.push(group);
                    }))
            }
        })
    return groups;
}


async function getTeachers() {
    let teachers = [];
    await fetch("https://api.rozklad.org.ua/v2/teachers")
        .then(checkStatus)
        .then(res => res.json())
        .then(json => json.meta.total_count) // getting count of groups
        .then(async function (count) {
            showLogMessage("info", `There are ${count} teachers`);
            const limit = Math.ceil(count / 100); // count of groups divided by 100 to get timetables 100 in one request

            for (let i = 0; i < limit; i++) {
                await fetch(`https://api.rozklad.org.ua/v2/teachers/?filter={'limit':100,'offset': ${i * 100}}`)
                    .then(res => res.json())
                    .then(json => json.data.map(obj => {
                        const teacher = {
                            id: obj.teacher_id,
                            name: obj.teacher_name,
                            fullName: obj.teacher_full_name,
                            shortName: obj.teacher_short_name,
                        };
                        teachers.push(teacher);
                    }))
            }
        })
    return teachers;
}


function writeScheduleToDB(getListFunc, dbUrl, apiUrl, model) {
    getListFunc().then(async elements => {
        const maxIndex = elements.length - 1;
        await mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
        await model.deleteMany({})

        for (let element of elements) {
            await fetch(encodeURI(apiUrl + `${element.id}/lessons`))
                .then(res => res.json())
                .then(async json => {
                    const newObj = new model(element);
                    newObj.lessons = (json.data) ? json.data : null;
                    await newObj.save();

                    (json.data) ?
                        showLogMessage('info', `${element.id} - (${element.name}) => schedule successfully added`) :
                        showLogMessage('warning', `${element.id} - (${element.name}) => schedule is null`);
                    if (elements.indexOf(element) === maxIndex) await mongoose.connection.close();


                })
                .catch(async err => {
                    showLogMessage("info", "Error while retrieving lessons");
                    showLogMessage("info", "Closing db connection");
                    await mongoose.connection.close();
                    console.log(err)
                })
        }
    })
}

writeScheduleToDB(getTeachers, config.dbUrl, 'https://api.rozklad.org.ua/v2/teachers/', Teachers)


module.exports.writeScheduleToDB = writeScheduleToDB;

// writeTeachersScheduleToDB(url, db, dbTeachersCollection);