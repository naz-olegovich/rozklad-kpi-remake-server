const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const {url, db, dbGroupsCollection, dbTeachersCollection} = require("../config").connection;


function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        throw Error(res.statusText);
    }
}

function showLogMessage(type, message) {
    const warningColor = '\x1b[1;33m';
    const infoColor = '\x1b[1;37m';

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


function writeGroupsScheduleToDB(dbUrl, dbName, dbCollection) {
    getGroups().then(groups =>
        // Connection to Mongo database
        MongoClient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true},
            async function (err, client) {
                if (err) throw err;
                const maxIndexOfGroups = groups.length - 1;
                const db = client.db(dbName);
                const collection = db.collection(dbCollection);
                await collection.deleteMany({}); //cleaning all collection

                for (let group of groups) {
                    await fetch(encodeURI(`https://api.rozklad.org.ua/v2/groups/${group.id}/lessons`))
                        .then(res => res.json())
                        .then(json => {

                            const schedule = {
                                _id: parseInt(group.id, 10),
                                name: group.name,
                                prefix: group.prefix,
                                okr: group.okr,
                                type: group.type,
                                lessons: (json.data) ? json.data : null
                            };

                            // adding schedule to db
                            collection.insertOne(schedule, (err, res) => {
                                if (err) throw err;
                                if (groups.indexOf(group) === maxIndexOfGroups) client.close();

                                (json.data) ?
                                    showLogMessage('info', `${group.id} - (${group.name}) => schedule successfully added`) :
                                    showLogMessage('warning', `${group.id} - (${group.name}) => schedule is null`);
                            });

                        })
                        .catch(err => {
                            console.log("Error while retrieving lessons");
                            throw err;
                        })
                }

            })).catch(err => {
        console.log("List of groups not received");
        throw err;
    })
}


function writeTeachersScheduleToDB(dbUrl, dbName, dbCollection) {
    getTeachers().then(teachers =>
        // Connection to Mongo database
        MongoClient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true},
            async function (err, client) {
                if (err) throw err;
                const maxIndexOfTeachers = teachers.length - 1;
                const db = client.db(dbName);
                const collection = db.collection(dbCollection);
                await collection.deleteMany({}); //cleaning all collection

                for (let teacher of teachers) {
                    // const teacherName = teacher.name.split('')
                    await fetch(encodeURI(`https://api.rozklad.org.ua/v2/teachers/${teacher.id}/lessons`))
                        .then(res => res.json())
                        .then(json => {
                            let lessons = {
                                _id: parseInt(teacher.id, 10),
                                name: teacher.name,
                                fullName: teacher.fullName,
                                shortName: teacher.shortName,
                                lessons: (json.data) ? json.data : null
                            };

                            // adding schedule to db
                            collection.insertOne(lessons, (err, res) => {
                                if (err) throw err;
                                if (teachers.indexOf(teacher) === maxIndexOfTeachers) client.close();

                                (json.data) ?
                                    showLogMessage('info', `${teacher.id} - (${teacher.name}) => schedule successfully added`) :
                                    showLogMessage('warning', `${teacher.id} - (${teacher.name}) => schedule is null`);
                            });

                        })
                        .catch(err => {
                            console.log("Error while retrieving lessons");
                            throw err;
                        })
                }
            })).catch(err => {
        console.log("List of teachers not received");
        throw err;
    })
}

module.exports.writeGroupsScheduleToDB = writeGroupsScheduleToDB;
writeGroupsScheduleToDB(url, db, dbGroupsCollection);
// writeTeachersScheduleToDB(url, db, dbTeachersCollection);