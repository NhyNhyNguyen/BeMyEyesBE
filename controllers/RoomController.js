const Room = require('../models/RoomModel')
exports.createRoom = function (req, res, next) {
    Room.findOne({id: req.body.id}, (err, room) => {
        if (room == null) { //Kiểm tra xem email đã được sử dụng chưa
            room = new Room()
        }
        room.id = req.body.id;
        room.name = req.body.name;
        room.avatarUrl = req.body.avatarUrl;
        room.createTime = Date.now();
        room.member = null;
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
        if (room == null || room.member != null) {
            return res.json({err: 1, message: "Room not found || Room is full"})
        } else {
            room.member = req.body.userJoinId;
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
    Room.find({member: null}, (err, rooms) => {
        if (rooms != null) {
            return res.json({err: 0, room: rooms})
        }
        return res.json({err: 0, room: []})
    })
}