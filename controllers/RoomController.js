const Room = require('../models/RoomModel')
const User = require('../models/UserModels')
const GlobalData = require('../models/GlobalData')

const {addHistoryAndPoint} = require('../controllers/UserControllers')
exports.createRoom = function (req, res, next) {
    Room.findOne({id: req.body.id}, (err, room) => {
        if (room == null) { //Kiểm tra xem email đã được sử dụng chưa
            room = new Room()
        }
        room.id = req.body.id;
        room.name = req.body.name;
        room.avatarUrl = req.body.avatarUrl;
        room.createTime = Date.now();
        room.members = null;
        room.save((err, result) => {
            if (err) {
                return res.json({err})
            }
        })
        return res.json({err: 0, message: "Create room successful"})
    })
}

exports.joinRoom = function (req, res, next) {
    Room.findOne({id: req.body.id}, (err, room) => {
        if (room == null) {
            return res.json({err: 1, message: "Room not found || Room is full"})
        } else {
            if (room.members == null) {
                room.members = [];
            }
            room.members.push(req.body.userJoinId);
            addHistoryAndPoint(req.body.userJoinId, req.body.id);
            room.save((err, result) => {
                if (err) {
                    return res.json({err: 1, message: "Save error"});
                }
            })
            return res.json({err: 0, message: "Join room successful"});
        }
    })
}

exports.removeRoom = function (req, res, next) {
    Room.findOne({id: req.query.id}, (err, room) => {
        if (room == null) {
            return res.json({err: 1, message: "Room not found"})
        } else {
            room.remove((err, result) => {
                if (err) {
                    return res.json({err: 1, message: "Save error"});
                }
            })
            return res.json({err: 0, message: "Remove room successful"});
        }
    })
}

exports.getRoomNotFull = function (req, res, next) {
    Room.find({members: null}, (err, rooms) => {
        if (rooms != null) {
            return res.json({err: 0, room: rooms})
        }
        return res.json({err: 0, room: []})
    })
}

exports.getAllRoom = async function (req, res) {
    try {
        let rooms = await Room.find().sort({createTime: -1}).exec();
        let volunteerNum = await User.count({role: "volunteer"}).exec();
        let blindNum = await User.count({role: "blind"}).exec();

        console.log('rooms length: ', rooms.length)
        res.render('/Users/user10/A42/DA/BeYourEyeBE/views/rooms.ejs', {
            data: rooms, globalData: {blindNum: blindNum.length, volunteerNum: volunteerNum, roomNum: rooms.length}
        });

    } catch (error) {
        res.status(500).json({
            message: 'Get list rooms failed',
            data: null
        })
    }
}