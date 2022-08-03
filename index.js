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
    var c = new JSONdb('./cache.json');
    var clean = new JSONdb('./lastUpdate.json');
    clean.JSON({
        lastModified:false
    })
    clean.sync()
    app.use((req, res, next) => {
            var cached = c.JSON();
            var dbUpdated = new JSONdb('./lastUpdate.json');
            var updated = dbUpdated.JSON();
            const date1 = new Date(updated.lastModified);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var pattern = /search/;
        if(pattern.exec(req.path)) {
            return request(options, function (error, response) {
                if (error) throw new Error(error)
                console.log(JSON.parse(response.body))
                var json = JSON.parse(response.body);
                db.JSON(json);
                db.sync();
                func.save();

                next();

            });
        }
        if(diffDays>1||!updated.lastModified||!cached.cache) {
            return request(options, function (error, response) {
                if (error) throw new Error(error)
                console.log(JSON.parse(response.body))
                var json = JSON.parse(response.body);
                db.JSON(json);
                db.sync();
                if(!pattern.exec(req.path)) {
                    func.save();
                }

                next();

            });
        }

                next()



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
app.use('/search', queriesRouter);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
