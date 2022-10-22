var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var transactionRouter = require('./routes/transaction');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
require('./middlewares/passport');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/transaction', transactionRouter);

module.exports = app;
