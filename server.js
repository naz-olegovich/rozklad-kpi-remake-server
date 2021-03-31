const express = require('express')
const {MongoClient} = require('mongodb');
const config = require("./config");


const app = express();
const PORT = config.port;
const dbUrl = config.connection.url;
const dbName = config.connection.db;
const dbCollection = config.connection.collection;


let db;
app.set('json spaces', 2);
// app.use(express.urlencoded({extended: true}));

// Setting up EJS Views
app.set('view engine', 'ejs');


// Initialize connection once
MongoClient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, async function (err, client) {
    if (err) throw err;
    db = client.db(dbName);

    // Start the application after the database connection is ready
    app.listen(PORT, () => {
        console.log(`Server has been started on http://localhost:${PORT}/`)
    });
    console.log(`Listening on port ${PORT}`);
});


app.get('/api/groups', (req, res) => {
    const projection = {"weeks": 0};
    const queryFilterParams = req.query;
    const limit = parseInt(queryFilterParams.limit, 10);
    const offset = parseInt(queryFilterParams.offset, 10);

    if (limit || offset) {
        db.collection(dbCollection).find().project(projection).skip(offset).limit(limit).toArray()
            .then(items => {
                res.json(items);
            })
            .catch(err => {
                res.json({statusCode: 404, message: "Not found"});
                throw err;
            })
    } else {
        db.collection(dbCollection).find().project(projection).toArray()
            .then(items => {
                res.json(items);
            })
            .catch(err => {
                res.json({statusCode: 404, message: "Not found"});
                res.send(err);
            })
    }
})


app.get('/timetable/group/:groupName', (req, res) => {
    db.collection(dbCollection).findOne({name: req.params.groupName}, function (err, dbResult) {
        if (err) throw err;
        if (dbResult != null) {
            res.status(200).json(dbResult)
        } else {
            res.status(404).send(`Групи ${req.params.groupName} не знайдено`)
        }
    })

})


app.get('/', (req, res) => {
    const links = [
        {name: 'Groups', link: '/api/groups'},
        {name: 'Groups with limitations', link: '/api/groups?limit=15&offset=3'},
        {name: 'Timetable for group', link: '/timetable/group/ів-91'},
    ]

    res.render('pages/index', {links: links});
});

app.get('*', function (req, res) {
    res.status(404).send('Not found');
});


// npm jest




