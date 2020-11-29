var express = require('express');
const {createRoom, joinRoom, removeRoom, getRoomNotFull} = require('../controllers/RoomController')
const RoomController = require('../controllers/RoomController')

var router = express.Router();

router.post('/create', createRoom)

router.post('/join', joinRoom)

router.get('/remove', removeRoom)

router.get('/getEmptyRoom', getRoomNotFull)

router.get('', (req, res) => RoomController.getAllRoom(req, res));

module.exports = router;
