const User = require('../models/UserModels')
const bcrypt = require('bcrypt')
exports.register = function(req, res, next){
   let userIds = [0,1,2,3, 4]
   let userId = userIds[0];
    for(let i = 0; i < userIds.length; i++)
{
     User.findOne({id: userIds[i]}, (err, user) => {
            if(user == null){
                   userId = userIds[i];
            }
        })

     }

    User.findOne({email: req.body.email}, (err, user) => {
        if(user == null){ //Kiểm tra xem email đã được sử dụng chưa
            bcrypt.hash(req.body.password, 10, function(err, hash){ //Mã hóa mật khẩu trước khi lưu vào db
                if (err) {return next(err);}
                const user = new User(req.body)
                user.password = hash;
                user.id = userId;
                user.save((err, result) => {
                    if(err) {return res.json({err})}
                    res.json({user: result})
                })
            })
        }else{
            res.json({err: 'Email has been used'})
        }
    })
}

exports.login = function(req, res){
    User.findOne({email: req.body.email}).exec(function(err, user){
        if(err) {
            return res.json({err})
        }else if (!user){
            return res.json({err: 'Username and Password are incorrect'})
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result === true){
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            }else{
                return res.json({err: 'Username and Password are incorrect'})
            }
        })
    })
}

exports.logout = function(req, res){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return res.json({err});
            } else {
                return res.json({'logout': "Success"});
            }
        });
    }
}

exports.getUserDetail = function(req, res){
    User.findOne({email: req.query.email}).exec(function(err, user){
        if(err) {
            return res.json({err})
        }else if (!user){
            return res.json({err: 'Username and Password are incorrect'})
        }
        bcrypt.compare(req.query.password, user.password, (err, result) => {
            if(result === true){
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            }else{
                return res.json({err: 'Username and Password are incorrect'})
            }
        })
    })
}
