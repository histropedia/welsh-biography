var express = require('express');
var router = express.Router();
var debug = require('debug')('dwb:routes');

router.get('/', function(req, res, next) {
  res.render('no-article');
});

module.exports = router;
