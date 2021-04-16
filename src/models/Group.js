'use strict';
const { Schema, model } = require('mongoose');

const Group = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    prefix: { type: String },
    okr: { type: String },
    type: { type: String },
    lessons: { type: Array }
});

module.exports = model('Group', Group);
