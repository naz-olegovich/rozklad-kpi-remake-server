const {Schema, model} = require('mongoose');

const Teacher = new Schema({
    id: {type: String, unique: true, required: true},
    name: {type: String},
    fullName: {type: String},
    shortName: {type: String},
    lessons: {type: Array}
})

module.exports = model("Teacher", Teacher)