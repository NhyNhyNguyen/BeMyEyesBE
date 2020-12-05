var express = require('express');
var test = require('./../page/test');
var fs = require('fs');
const {UserValidator, PostValidator} = require('../validators/validator')
const {register, login, logout, getUserDetail, getAllUserByRole, update, getSizeUser} = require('../controllers/UserControllers')
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

function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({err: 'You must be logged in to view this page.'});
    }
}

router.get('/logout', requiresLogin, logout)

router.post('/login', requiresLogout, login)

router.post('/register', UserValidator, register)

router.get('/login', getUserDetail)

router.get('/getAllUserByRole', getAllUserByRole)

router.post('/updateProfile', update)

router.get('/sendNotification', sendNotification)

router.get('/getSizeUser', getSizeUser)

router.get('/', function (req, res, next) {
    res.render('login', {});
});

router.get('/volunteer', (req, res, next) =>
    UserController.getAllVolunteer(req, res));

router.get('/blind', (req, res, next) =>
    UserController.getAllBlind(req, res));

module.exports = router;
