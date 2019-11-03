var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var i18n = require('i18n');

var indexRouter = require('./routes/index');
var noArticleRouter = require('./routes/no-article');

var app = express();

i18n.configure({
  locales:['en-GB', 'cy'],
  defaultLocale: 'en-GB',
  queryParameter: 'lang',
  autoReload: true,
  directory: path.join(__dirname, '/locales')
});

// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/no-article', noArticleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
