var express = require('express');
var router = express.Router();
var debug = require('debug')('dwb:routes');
var i18n = require('i18n');

/* GET home page. */
router.get('/', function(req, res, next) {
  var requestLang = i18n.getLocale(req)
  debug("request language: ", requestLang);
  res.render('index', {lang: requestLang});
});

module.exports = router;
