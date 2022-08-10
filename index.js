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
    var queriesRouter2 = require('./routes/queries2');

var roomsRouter = require('./routes/rooms');
var cartRouter = require('./routes/cart');
const JSONdb = require("simple-json-db");
    const request = require("request");
    const options = require("./routes/auth");
    const func = require("./routes/request");


    var db = new JSONdb('./db.json');
    db.JSON({})
    db.sync()

    var c = new JSONdb('./cache.json');
    app.use((req, res, next) => {
            var cached = c.JSON();
        var pattern = 'search'; var pattern2 = 'refresh';var pattern3 = 'cart';
        if(req.path.includes(pattern2)) {
            return request(options, function (error, response) {
                if (error) throw new Error(error)
                var json = JSON.parse(response.body);
                db.JSON(json);
                db.sync();
                func.save()
                res.send('Thy will be done, milorddddd')
            });
        }
            if(req.path.includes(pattern)||req.path.includes(pattern3)) {
            return request(options, function (error, response) {
                if (error) throw new Error(error)
                var json = JSON.parse(response.body);
                db.JSON(json);
                db.sync();
                next();

            });
        }
        if(!cached.cache) {
            return request(options, function (error, response) {
                if (error) throw new Error(error)
                var json = JSON.parse(response.body);
                db.JSON(json);
                db.sync();
              func.save();

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
app.use('/search2', queriesRouter2);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
