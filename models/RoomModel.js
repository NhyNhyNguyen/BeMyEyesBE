const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    id: {type: Number, unique: true, required: true, trim: true},
    members: {type: Array, require: false},
    name: {type: String},
    avatarUrl: {type: String},
    createTime: {type: Number}
});

module.exports = mongoose.model('Room', roomSchema)