const mongoose = require('mongoose')
const Schema = mongoose.Schema

const globalDataSchema = new Schema({
    numHelped: {type: Number},
    numRoomCreate: {type: Number}
});

module.exports = mongoose.model('GlobalData', globalDataSchema)