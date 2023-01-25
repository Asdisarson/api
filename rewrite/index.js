const PORT = process.env.PORT || 5000
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("express");
var app = express()
const JSONdb = require("simple-json-db");
const request = require("request");
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));

//Endpoints
var indexRouter = require('./endpoints/index');
var propertiesRouter = require('./endpoints/properties');
var searchRouter = require('./endpoints/search');
var cancellationRouter = require('./endpoints/cancellationPolicy');
var roomsRouter = require('./endpoints/rooms');
var nicedollarsRouter = require('./endpoints/niceDollars');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Authorization verify
app.use((req, res, next) => {

})


app.use('/', indexRouter);
app.use('/cancellationpolicy', cancellationRouter);
app.use('/properties', propertiesRouter);
app.use('/nicedollars', nicedollarsRouter);
app.use('/search', searchRouter);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
