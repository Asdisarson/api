var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var propertiesRouter = require('./routes/properties');
var queriesRouter = require('./routes/queries');
var roomsRouter = require('./routes/rooms');
var cartRouter = require('./routes/cart');
const JSONdb = require("simple-json-db");

var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use((req, res, next) => {
    var request = require('request')
  var db = new JSONdb('./db.json');
        var options = require('./routes/auth.js')
         return request(options, function (error, response) {
            if (error) throw new Error(error)
             var json = JSON.parse(response.body);
            db.JSON(json);
            db.sync();
            return next();
        });
        // -----------------------------------------------------------------------
    // authentication middleware
/*
    const auth = {login: 'yourlogin', password: 'yourpassword'} // change this

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message

    // -----------------------------------------------------------------------
*/
})
app.use('/', indexRouter);
app.use('/properties', propertiesRouter);
app.use('/queries', queriesRouter);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);   
