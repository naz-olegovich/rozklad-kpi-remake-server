const express = require('express');
const scheduleRouter = require('../src/routes/scheduleRouter');
const request = require('supertest');
const mongoose = require('mongoose');
const app = express();
const { dbUrl } = require('../config');
const Groups = require('../src/models/Group');
const Teacher = require('../src/models/Teacher');


beforeAll(async () => {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    app.use('/api', scheduleRouter);
})

afterAll(async () => {
    await mongoose.connection.close()
})

describe('testing groups api" ', () => {
    it('GET /api/group (with limit)', async () => {
        const res = await request(app).get('/api/groups?limit=500'); //uses the request function that calls on express app instance
        const expectedFromDb = await Groups.find({}, { _id: 0, __v: 0, lessons: 0 }).limit(500)

        expect(mongoose.connection.readyState).toEqual(1) //1: connected
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(expectedFromDb)));
    });

    it('GET /api/group (with offset)', async () => {
        const res = await request(app).get('/api/groups?offset=500'); //uses the request function that calls on express app instance
        const expectedFromDb = await Groups.find({}, { _id: 0, __v: 0, lessons: 0 }).limit(500).skip(500)

        expect(mongoose.connection.readyState).toEqual(1) //1: connected
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(expectedFromDb)));
    });

    it('GET /groups/:id/lessons(by id) - success', async () => {

        const res = await request(app).get('/api/groups/537/lessons'); //uses the request function that calls on express app instance
        const query = { $or: [{ id: 537 }] };
        const projection = { _id: 0, __v: 0 };
        const expectedFromDb = await Groups.findOne(query, projection);

        expect(mongoose.connection.readyState).toEqual(1) //1: connected
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(expectedFromDb)));
    });

    it('GET /groups/:id/lessons(by id) - error', async () => {

        const res = await request(app).get('/api/groups/-1/lessons');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({
            "message": "Group not found",
            "statusCode": 404
        })
    });

    it('GET /groups/:id/lessons (by name) - success', async () => {
        const res = await request(app).get(`/api/groups/${encodeURI('ів-91')}/lessons`); //uses the request function that calls on express app instance
        const query = { $or: [{ name: 'ів-91' }] };
        const projection = { _id: 0, __v: 0 };
        const expectedFromDb = await Groups.findOne(query, projection);

        expect(mongoose.connection.readyState).toEqual(1) //1: connected
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.parse(JSON.stringify(expectedFromDb)));
    });

    it('GET /groups/:id/lessons (by name) - error', async () => {
        const res = await request(app).get('/api/groups/some-unexpected-name/lessons');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({
            "message": "Group not found",
            "statusCode": 404
        })
    });

});
