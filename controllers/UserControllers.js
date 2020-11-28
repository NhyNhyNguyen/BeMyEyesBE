const User = require('../models/UserModels')
const GlobalData = require('../models/GlobalData')
const {sendNotifications} = require('../controllers/FileBaseControllers')
const bcrypt = require('bcrypt')
const maxUserSendCall = 1;
exports.register = function (req, res, next) {
    User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, (err, user) => {
        if (user == null) { //Kiểm tra xem email đã được sử dụng chưa
            bcrypt.hash(req.body.password, 10, function (err, hash) { //Mã hóa mật khẩu trước khi lưu vào db
                if (err) {
                    return next(err);
                }
                const user = new User(req.body)
                user.password = hash;
                user.avatarUrl = "";
                user.createTime = Date.now();
                user.helps = [];
                user.numHelp = 0;
                user.point = 0;
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
            if (userIDs.length < maxUserSendCall) {
                userIDs.push(parseInt(x.id))
            }
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

        if (req.body.avatarUrl) {
            user.avatarUrl = req.body.avatarUrl;
        }
        user.save((err, result) => {
            if (err) {
                return res.json({err})
            }
        })
        return res.json(user);
    });
}

exports.getSizeUser = function (req, res) {
    User.find({role: "blind"}).exec(function (err, blinds) {
        let blindSize = 0;
        let volunteerSize = 0;
        blindSize = blinds != null ? blinds.length : 0;

        User.find({role: "volunteer"}).exec(function (err, volunteers) {
            volunteerSize = volunteers != null ? volunteers.length : 0;
            return res.json({blind: blindSize, volunteer: volunteerSize})
        });
    });
}

exports.addHistoryAndPoint = function (userId, helpedUserId) {
    User.findOne({id: userId}).exec(function (err, user) {
        if (user.helps == null || user.helps.length == 0) {
            user.helps = [];
            user.numHelp = 0;
            user.point = 0;
        }
        user.helps.push({time: Date.now(), helpedUserId: helpedUserId});
        user.numHelp = user.numHelp + 1;
        user.point = user.point + 10;
        user.save((err, result) => {
            if (err) {
            }
        });
    });
    GlobalData.findOne().exec(
        function (err, data) {
            if (data == null) {
                data = new GlobalData();
            }
            if (data.numHelped == null) {
                data.numHelped = 0;
            }
            data.numHelped += 1;
            data.save((err, result) => {
                if (err) {
                }
            });
        }
    )
}
