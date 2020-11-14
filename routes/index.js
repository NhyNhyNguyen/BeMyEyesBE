var express = require('express');
var test = require('./../page/test');
var fs = require('fs');
const {UserValidator, PostValidator} = require('../validators/validator')
const {register, login, logout, getUserDetail, getAllUserByRole, update} = require('../controllers/UserControllers')
const {listPost, detailPost, createPost, editPost, deletePost} = require('../controllers/PostControllers')
const {sendNotification} = require('../controllers/FileBaseControllers')

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

router.get('/posts', requiresLogin, listPost)
router.get('/post/:id', requiresLogin, detailPost)
router.post('/post/new', requiresLogin, PostValidator, createPost)
router.put('/post/:id/edit', requiresLogin, PostValidator, editPost)
router.delete('/post/:id', requiresLogin, deletePost)

router.get('/logout', requiresLogin, logout)

router.post('/login', requiresLogout, login)

router.post('/register', UserValidator, register)

router.get('/login', getUserDetail)

router.get('/getAllUserByRole', getAllUserByRole)

router.post('/updateProfile', update)

router.get('/sendNotification', sendNotification)

module.exports = router;
