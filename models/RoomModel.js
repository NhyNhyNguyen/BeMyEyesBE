const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    id: {type: Number, unique: true, required: true, trim: true},
    member: {type: Number, require: false},
});

module.exports = mongoose.model('Room', roomSchema)