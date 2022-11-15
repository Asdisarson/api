var PORT = process.env.PORT || 5000
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("express");
var app = express()
var JSONdb = require("simple-json-db");
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
var queriesRouter    = require('./search.js');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/search', queriesRouter);


app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
