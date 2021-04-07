const express = require('express');
const mongoose = require('mongoose');
const config = require("./config");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// const jsonProcessing = require("./src/jsonProcessing.js")
const scheduleRouter = require('./src/routes/scheduleRouter');

const PORT = config.port;
const dbUrl = config.dbUrl;


const app = express();
app.set('json spaces', 2);  // To return formatted json
app.use("/api", scheduleRouter);

const start = async () => {
    try {
        await mongoose.connect(
            dbUrl,
            {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`))
    } catch (e) {
        console.log(e);
    }
}

start()


let swaggerDocument = YAML.load('./server-api.yaml');
swaggerDocument.host = config.host;
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCssUrl: "sw-theme.css"}));



