var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var winston = require('winston');
var nunjucks = require('nunjucks');
var secrets = require('./secrets');

var ig = require('instagram-node').instagram();
ig.use({
    client_id: secrets.ID,
    client_secret: secrets.secret
});

ig.media_popular(function(err, media, limit) {
    if(err) {
        throw err; }
    console.log(media);
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

winston.add(winston.transports.File, {
  filename: 'error.log',
  level: 'error'
});
// winston.error('Something went wrong');
winston.profile

nconf.defaults({
  "http": {
    "port": 3000
  }
});

winston.info('Initialised nconf');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;