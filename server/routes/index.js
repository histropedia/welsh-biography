var express = require('express');
var router = express.Router();
var debug = require('debug')('dwb:routes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
