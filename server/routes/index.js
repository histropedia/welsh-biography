var express = require('express');
var router = express.Router();
var debug = require('debug')('server:routes'); 

/* GET home page. */
router.get('/', function(req, res, next) {

  //debug("debug example: ", process.env.NODE_ENV);

  res.render('index');
});

module.exports = router;
