const express = require('express');
const {MongoClient} = require('mongodb');
const config = require("./config");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const jsonProcessing = require("C:/Users/Nazar/Documents/GitHub/rozklad-kpi-remake-server/src/jsonProcessing.js")


const app = express();
const PORT = config.service.port;
const dbUrl = config.connection.url;
const dbName = config.connection.db;
const dbGroupsCollection = config.connection.dbGroupsCollection;
const dbTeacherCollection = config.connection.dbTeachersCollection;
let db; // global db connection


app.set('json spaces', 2);  // To return formatted json
// app.use(express.urlencoded({extended: false}));
// app.use(bodyParser.json());

// Initialize connection once to db
MongoClient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, async function (err, client) {
    if (err) throw err;
    db = client.db(dbName);

    // Start the application after the database connection is ready
    app.listen(PORT, () => {
        console.log(`Server has been started on http://localhost:${PORT}/`);
    });
    console.log(`Listening on port ${PORT}`);
});


app.get('/api/groups', (req, res) => {
    const projection = {"lessons": 0};
    const queryFilterParams = req.query;
    const limit = parseInt(queryFilterParams.limit, 10) || 500;
    const offset = parseInt(queryFilterParams.offset, 10) || 0;

    db.collection(dbGroupsCollection).find().project(projection)
        .skip(offset)
        .limit(limit)
        .toArray()
        .then(items => {
            items ?
                res.status(200).json(items) :
                res.status(404).json({statusCode: 404, message: "Groups not found or db is empty"});
        })
        .catch(err => res.status(500).json({statusCode: 500, message: "Server error occurred"}));
})

app.get('/api/groups/:group/lessons', (req, res) => {
    const query = {$or: [{_id: parseInt(req.params.group, 10)}, {name: req.params.group}]}; // dont forget to change id value to int
    db.collection(dbGroupsCollection).findOne(query)
        .then(dbResult => {
            dbResult ?
                res.status(200).json(dbResult) :
                res.status(404).json({statusCode: 404, message: "Group not found"});
        })
        .catch(err => res.status(500).json({statusCode: 500, message: `Error occurred`}));
})

app.get('/api/groups/:group/timetable', (req, res) => {
    const query = {$or: [{_id: parseInt(req.params.group, 10)}, {name: req.params.group}]};
    db.collection(dbGroupsCollection).findOne(query)
        .then(dbResult => {
            if (dbResult) {
                const groupData = {
                    id: dbResult._id,
                    name: dbResult.name,
                    prefix: dbResult.prefix,
                    okr: dbResult.okr,
                    type: dbResult.type
                };
                const timetable = jsonProcessing.createTimetable(dbResult.lessons)
                res.status(200).json(Object.assign(groupData, timetable))
            } else {
                res.status(404).json({statusCode: 404, message: "Group not found"})
            }
        })
        .catch(err => res.status(500).json({statusCode: 500, message: "Server error occurred"}));
})


app.get('/api/teachers', (req, res) => {
    const projection = {"lessons": 0};
    const queryFilterParams = req.query;
    const limit = parseInt(queryFilterParams.limit, 10) || 500;
    const offset = parseInt(queryFilterParams.offset, 10) || 0;

    db.collection(dbTeacherCollection).find().project(projection)
        .skip(offset)
        .limit(limit)
        .toArray()
        .then(items => {
            items ?
                res.status(200).json(items) :
                res.status(404).json({statusCode: 404, message: "Teachers not found or db is empty"});
        })
        .catch(err => res.status(500).json({statusCode: 500, message: "Error occurred"}));
})

app.get('/api/teachers/:teacher/lessons', (req, res) => {
    const query = {$or: [{_id: parseInt(req.params.teacher, 10)}, {name: req.params.teacher}]}; // dont forget to change id value to int
    db.collection(dbTeacherCollection).findOne(query)
        .then(dbResult => {
            dbResult ?
                res.status(200).json(dbResult) :
                res.status(404).json({statusCode: 404, message: "Teacher not found"});
        })
        .catch(err => res.status(500).json({statusCode: 500, message: `Error occurred`}));
})

app.get('/api/teachers/:teacher/timetable', (req, res) => {
    const query = {$or: [{_id: parseInt(req.params.teacher, 10)}, {name: req.params.teacher}]};
    db.collection(dbTeacherCollection).findOne(query)
        .then(dbResult => {
            if (dbResult) {
                const teacherData = {
                    id: dbResult._id,
                    name: dbResult.name,
                    fullName: dbResult.fullName,
                    shortName: dbResult.shortName
                };
                const timetable = jsonProcessing.createTimetable(dbResult.lessons)
                res.status(200).json(Object.assign(teacherData, timetable))
            } else {
                res.status(404).json({statusCode: 404, message: "Teacher not found"})
            }
        })
        .catch(err => res.status(500).json({statusCode: 500, message: `Error occurred`}));
})


let swaggerDocument = YAML.load('./server-api.yaml');
swaggerDocument.host = config.service.host;
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCssUrl: "sw-theme.css"}));

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});


// npm jest




