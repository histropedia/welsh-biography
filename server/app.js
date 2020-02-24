var createError = require('http-errors');
var cookieSession = require('cookie-session');
var express = require('express');
var helmet = require('helmet')
var path = require('path');
var logger = require('morgan');
var i18n = require('i18n');
var cron = require('node-cron');
var debug = require('debug')('dwb:app');

var localeRouter = require('./routes/locale');
var indexRouter = require('./routes/index');
var noArticleRouter = require('./routes/no-article');
var updateTimelineData = require('./data-update').updateTimelineData;

var app = express();

// basic setup
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie setup
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  keys: ["dwbkey1", "dwbkey2"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// i18n setup and redirecting
i18n.configure({
  locales: ['en', 'cy'],
  defaultLocale: 'en',
  autoReload: true,
  directory: path.join(__dirname, '/locales')
});

app.use(i18n.init);
app.use(localeRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

// Update timeline data from Wikidata every Sunday at 1:00 a.m.
if (process.env.NODE_ENV === 'production') {
  // Todo: Only run in parent process if app running in 'cluster mode' with multi cpu server 
  cron.schedule('0 1 * * Sunday', updateTimelineData);
}

module.exports = app;
