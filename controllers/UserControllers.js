const User = require('../models/UserModels')
const {sendNotifications} = require('../controllers/FileBaseControllers')
const bcrypt = require('bcrypt')
exports.register = function (req, res, next) {
    User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, (err, user) => {
        if (user == null) { //Kiểm tra xem email đã được sử dụng chưa
            bcrypt.hash(req.body.password, 10, function (err, hash) { //Mã hóa mật khẩu trước khi lưu vào db
                if (err) {
                    return next(err);
                }
                const user = new User(req.body)
                user.password = hash;
                user.save((err, result) => {
                    if (err) {
                        return res.json({err})
                    }
                    res.json({user: result})
                })
            })
        } else {
            res.json({err: 'Email or Username has been used'})
        }
    })
}

exports.login = function (req, res) {
    User.findOne({email: req.body.email}).exec(function (err, user) {
        if (err) {
            return res.json({err})
        } else if (!user) {
            return res.json({err: 'Username and Password are incorrect'})
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result === true) {
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            } else {
                return res.json({err: 'Username and Password are incorrect'})
            }
        })
    })
}

exports.logout = function (req, res) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return res.json({err});
            } else {
                return res.json({'logout': "Success"});
            }
        });
    }
}

exports.getUserDetail = function (req, res) {
    User.findOne({email: req.query.email}).exec(function (err, user) {
        if (err) {
            return res.json({err})
        } else if (!user) {
            return res.json({err: 'Username and Password are incorrect'})
        }
        bcrypt.compare(req.query.password, user.password, (err, result) => {
            if (result === true) {
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            } else {
                return res.json({err: 'Username and Password are incorrect'})
            }
        })
    })
}

exports.getAllUserByRole = function (req, res) {
    User.find({role: req.query.role}).exec(function (err, users) {
        if (err) {
            return res.json({err})
        }
        let userIDs = [];
        let tokens = [];
        users.forEach(function (x) {
            userIDs.push(parseInt(x.id))
            if (x.token != null && x.token != "") {
                tokens.push(x.token);
            }
        })
        sendNotifications(tokens, req.query.roomID)
        return res.json(userIDs);
    });
}

exports.update = function (req, res) {
    User.findOne({id: parseInt(req.body.id)}).exec(function (err, user) {
        if (err) {
            return res.json({err})
        }
        if (req.body.token) {
            user.token = req.body.token;
        }
        if (req.body.username) {
            user.username = req.body.username;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        user.save((err, result) => {
            if (err) {
                return res.json({err})
            }
        })
        return res.json(user);
    });
}
