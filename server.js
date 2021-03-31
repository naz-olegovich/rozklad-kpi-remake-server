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
app.use(express.urlencoded({extended: true}));

// Setting up EJS Views
// app.set('views engine', 'ejs');
// app.set('views', __dirname);
// app.use(scheduleRoutes);


// Initialize connection once
MongoClient.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, async function (err, client) {
    if (err) throw err;
    db = client.db(dbName);

    // Start the application after the database connection is ready
    app.listen(PORT, () => {
        console.log(`Server has been started on http://localhost:${PORT}/timetable/group/`)
    });
    console.log(`Listening on port ${PORT}`);
});

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

app.get("/", function (req, res) {
    res.json({"ok":1})
})


app.get('*', function (req, res) {
    res.status(404).send('Not found');
});


// npm jest




