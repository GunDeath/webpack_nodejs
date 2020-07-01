/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon')
const createError = require('http-errors')

const app = express(); 

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000
const indexPouter =require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


app.use('/', indexPouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs');
//render HTML
app.engine('html', require('ejs').renderFile);

// catch errors
app.use((req, res, next) => {
    next(new createError.NotFound());
})

//error  handle
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error.html' , {err})
})

app.listen(port, () => console.log('server start'));