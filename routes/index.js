var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nemesia' });
});

router.get('/stream', function(req, res, next) {
    res.render('streamview', { title: 'Nemesia Stream' });
});

module.exports = router;
