// const url = "mongodb://localhost:27017/";
// const dbName = "rozklad_kpi_remake";
// const dbGroupsCollection = "groupsLessons";
// const dbTeachersCollection = "teachersLessons";
// const port = 3000
// const baseURL = `http://localhost:${port}`;


module.exports = {
    dbUrl: "mongodb://localhost:27017/rozklad_kpi_remake",
    port: process.env.PORT || 3000,
    host: process.env.HOST || `localhost:3000`,
}