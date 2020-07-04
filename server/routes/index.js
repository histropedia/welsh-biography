var express = require('express');
var router = express.Router();
var debug = require('debug')('dwb:routes');

/* GET home page. */
router.get('/', function(req, res, next) {
  debug(process.env.GTM_ID)
  res.render('index', {gtmId: process.env.GTM_ID});
});

module.exports = router;
