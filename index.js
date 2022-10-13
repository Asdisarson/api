    const PORT = process.env.PORT || 5000
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
    const bodyParser = require("express");
    var app = express()
    const JSONdb = require("simple-json-db");
    const request = require("request");
    const auth = require("./routes/auth");
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    const {save} = require("./routes/request");
    var indexRouter = require('./routes/index');
    var propertiesRouter = require('./routes/properties');
    var queriesRouter = require('./routes/search');
    var roomsRouter = require('./routes/rooms');
    var cartRouter = require('./routes/cart');
    const {setTimeOut, checkCache} = require("./routes/checktime");
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    request(auth, function(error, response) {
        if (error) throw new Error(error)
        var db = new JSONdb('./cache.json');

        db.JSON({cache:false,
            cacheTimeOut: setTimeOut(3).toString(),
            token: JSON.parse(response.body),
            data: [],
            cart:[]
        });
        db.sync();

    })
    app.use((req, res, next) => {
      var  db = new JSONdb('./cache.json');
        var cached = db.JSON().cache;
        checkCache(db.JSON().cacheTimeOut)
        if(cached)  {
            console.log('cache')
            next();
        }
        else {
            request(auth, function(error, response) {
                if (error) throw new Error(error)
                console.log('Auth')
                db.JSON({cache:false,
                    cacheTimeOut: setTimeOut(3).toString(),
                    token: JSON.parse(response.body),
                    data: [],
                    cart:[]
                });
                db.sync();
                save();
                next()
                var log = save();
                console.log(db.JSON())
                if(log) {
                    console.log(log)
                }
            })
        }
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
