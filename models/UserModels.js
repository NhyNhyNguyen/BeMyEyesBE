const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {type: String, unique: true, required: true, trim: true},
    username: {type: String, required: true, trim: true, minlength: 2},
    role: {type: String, require: true, enum: ['admin', 'blind', 'volunteer']},
    password: {type: String, required: true, trim: true, minlength: 6},
    token: {type: String, require: false},
    avatarUrl: {type: String, require: false},
    id: {type: Number, require: false},
    createTime: {type: Number, require: false},
    nameTag: {type: String, enum: ['Blind', 'Trusted helper', 'Volunteer']},
    numHelp: {
        type: Number
    },
    point: {
        type: Number
    },
    helps: {
        type: Array
    }
});

module.exports = mongoose.model('User', userSchema)