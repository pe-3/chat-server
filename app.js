const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 路由
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const mailRouter = require('./routes/mail');
const {authRouter} = require('./midware/auth');
const friendRouter = require('./routes/friend');

// 中间件
const signal = require('./midware/signal');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); // 解析 JSON 数据
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use(signal);
app.use('/user', userRouter);
app.use('/mail', mailRouter);
app.use(authRouter);

// 注册需要鉴权的路由模块
authRouter.use('/friend', friendRouter);


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
