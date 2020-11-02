var express = require('express');
var test = require('./../page/test');
var fs = require('fs');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

router
    .route('/api/v1/cognitive_face/')
    .post(cognitiveFace);

module.exports = router;
