var express = require('express');
var router = express.Router();
var debug = require('debug')('dwb:routes:locale')

// Set local from URL
router.use('/:locale', function(req, res, next) {
  var requestLocale = req.params.locale;
  var supportedLocales = req.getLocales();
  if (supportedLocales.includes(requestLocale)) {
    // Set locale in cookie and redirect to root
    req.session.locale = requestLocale;
    return res.redirect('/');
  }
  next()
});

// Set locale from cookie
router.use(function(req, res, next) {
  if (req.session.locale) {
    // Return session, set locale from cookie
    req.setLocale(req.session.locale);
  } else {
    // New session, set locale in 
    req.session.locale = req.getLocale();
  }

  // Make locale avaialble in all view templates
  res.locals.lang = req.session.locale;
  next();
});

module.exports = router;
