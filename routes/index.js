var express = require('express');
var test = require('./../page/test');
var fs = require('fs');
const {UserValidator, PostValidator} = require('../validators/validator')
const {register, login, logout, getUserDetail, getAllUserByRole, update, getSizeUser,loginByAdmin, deleteUserById} = require('../controllers/UserControllers')
const { deleteRoomById} = require('../controllers/RoomController')
const {sendNotification} = require('../controllers/FileBaseControllers')
const UserController = require('../controllers/UserControllers')

var router = express.Router();

function requiresLogout(req, res, next) {
    if (req.session && req.session.user) {
        return res.json({err: 'You must be Logout in to Login continue'});
    } else {
        return next();
    }
}

function loggedIn(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({err: 'You must be logged in to view this page.'});
    }
}


router.post('/login', requiresLogout, login)

router.post('/signIn', loginByAdmin)

router.post('/register', UserValidator, register)

router.get('/login', getUserDetail)

router.get('/getAllUserByRole', getAllUserByRole)

router.post('/updateProfile', update)

router.get('/sendNotification', sendNotification)

router.get('/getSizeUser', getSizeUser)

router.get('/', function (req, res, next) {
    res.render('login', {});
});

router.get('/signIn', function (req, res, next) {
    res.render('login', {});
});

router.get('/volunteer', loggedIn,(req, res, next) =>
    UserController.getAllVolunteer(req, res));

router.get('/blind',loggedIn, (req, res, next) =>
    UserController.getAllBlind(req, res));

router.get('/logout', function(req, res, next) {
    // remove the req.user property and clear the login session
    req.logout();
    res.clearCookie('connect.sid', {path: '/'});
    res.clearCookie('connection.sid');
    // destroy session data
    req.session = null;

    // redirect to homepage
    res.redirect('/');
});

router.delete('/users/:id',deleteUserById)
router.delete('/rooms/:id',deleteRoomById)

module.exports = router;
