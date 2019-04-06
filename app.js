var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var logoutRouter = require('./routes/logout');
var signUpRouter = require('./routes/signUp');
var uploadRouter = require('./routes/upload');
var uploadcodeRouter = require('./routes/uploadcode');
var checkRouter = require('./routes/check');
var updateRouter = require('./routes/update');
var queryRouter = require('./routes/query');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(function(req, res, next) { 
//   res.locals.session = req.session;
//   next();
// });
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  	secret: 'ecloud-session-secret',
  	resave: false,
  	saveUninitialized: true,
  	cookie: { 
  		path: '/',
  		// secure: true,
  		maxAge : 1000 * 60 * 30
  	}
}));

app.use('/', indexRouter);
app.use('/logout', logoutRouter);
app.use('/signUp', signUpRouter);
app.use('/upload', uploadRouter);
app.use('/check/', checkRouter);
app.use('/update/', updateRouter);
app.use('/query/', queryRouter);
app.use('/admin/', adminRouter);
app.use('/uploadcode', uploadcodeRouter);
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
