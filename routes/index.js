var express = require('express');
var test = require('./../page/test');
var fs = require('fs');
const {UserValidator, PostValidator} = require('../validators/validator')
const {register, login, logout} = require('../controllers/UserControllers')
const {listPost, detailPost, createPost, editPost, deletePost} = require('../controllers/PostControllers')

var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
//});

const getStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './stats.json'));
    const stats = JSON.parse(data);
    const playerStats = stats.find(player => player.id === Number(req.params.id));
    if (!playerStats) {
      const err = new Error('Player stats not found');
      err.status = 404;
      throw err;
    }
    res.json(playerStats);
  } catch (e) {
    next(e);
  }
};

router
    .route('/api/v1/stats/:id')
    .get(getStats);

const cognitiveFace = async (req, res, next) => {
  try {
    if (req.body.url == null || req.body.url == "") {
      const err = new Error('Url not found');
      err.status = 404;
      throw err;
    }

    console.log("url: " + req.body.url);
    var result = test.recognize(req.body.url);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

function requiresLogout(req, res, next){
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
router.get('/post/:id',requiresLogin, detailPost)
router.post('/post/new', requiresLogin, PostValidator, createPost)
router.put('/post/:id/edit', requiresLogin, PostValidator, editPost)
router.delete('/post/:id', requiresLogin, deletePost)

router.get('/logout', requiresLogin, logout)

router.post('/login', requiresLogout, login)

router.post('/register', UserValidator, register)

router
    .route('/api/v1/cognitive_face/')
    .post(cognitiveFace);

module.exports = router;
