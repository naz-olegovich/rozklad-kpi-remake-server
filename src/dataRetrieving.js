const fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;
const {url, db, collection} = require("../config").connection;


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
            showLogMessage("info",`There are ${count} groups`);
            const limit = Math.ceil(count / 100); // count of groups divided by 100 to get timetables 100 in one request

            for (let i = 0; i < limit; i++) {
                await fetch("http://api.rozklad.org.ua/v2/groups/?filter={'limit':100,'offset':" + (i * 100) + "}")
                    .then(res => res.json())
                    .then(json => json.data.map(x => groups.push({id: x.group_id, name: x.group_full_name})))
            }
        }).catch(err => {
            // Some actions before throwing;
            throw err;
        })
    return groups;
}

function writeScheduleToDB(dbUrl, dbName, dbCollection) {
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
                    await fetch(encodeURI("https://api.rozklad.org.ua/v2/groups/" + group.name + "/timetable"))
                        .then(res => res.json())
                        .then(json => {

                            let schedule = {
                                _id: group.id,
                                name: group.name,
                                weeks: (json.data) ? json.data.weeks : null
                            }

                            // adding schedule to db
                            collection.insertOne(schedule, (err, res) => {
                                if (err) throw err;
                                if (groups.indexOf(group) === maxIndexOfGroups) client.close();

                                (json.data) ?
                                    showLogMessage('info', `${group.id} - (${group.name}) => schedule successfully added`) :
                                    showLogMessage('warning', `${group.id} - (${group.name}) => schedule is null`)
                            });

                        })
                        .catch(err => {
                            // Some actions before throwing;
                            throw err;
                        })
                }

            })).catch(err => {
        console.log("Групи не отримано")
        throw err
    })
}

module.exports.writeScheduleToDB = writeScheduleToDB
writeScheduleToDB(url, db, collection);

