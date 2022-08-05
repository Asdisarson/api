    const PORT = process.env.PORT || 5000
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
    const bodyParser = require("express");
    var app = express()

    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
var indexRouter = require('./routes/index');
var propertiesRouter = require('./routes/properties');
var queriesRouter = require('./routes/queries');
var roomsRouter = require('./routes/rooms');
var cartRouter = require('./routes/cart');
const JSONdb = require("simple-json-db");
    const request = require("request");
    const options = require("./routes/auth");
    const func = require("./routes/request");


    var db = new JSONdb('./db.json');
    db.JSON({})
    db.sync()

    app.use((req, res, next) => {
                next()



        // -----------------------------------------------------------------------
    // authentication middleware
/*


    // -----------------------------------------------------------------------
*/
})
app.use('/', indexRouter);
app.use('/properties', propertiesRouter);
app.use('/search', queriesRouter);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
