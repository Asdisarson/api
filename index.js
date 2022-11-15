    const PORT = process.env.PORT || 5000
    let express = require('express');
    let path = require('path');

    let cookieParser = require('cookie-parser');
    let logger = require('morgan');
    const bodyParser = require("express");
    let app = express();
    const JSONdb = require("simple-json-db");
    const request = require("request");
    const auth = require("./routes/auth");
    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    //const {save} = require("./routes/request2");
const {save} = require("./routes/request");
    let indexRouter = require('./routes/index');
    let propertiesRouter = require('./routes/properties');
    //   var queriesRouter = require('./routes/searchtest');
    let queriesRouter = require('./routes/search');
    let roomsRouter = require('./routes/rooms');
    let cancel = require('./routes/cancellationPolicy');
    let cartRouter = require('./routes/cart');
    const {setTimeOut, checkCache} = require("./routes/checktime");
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    request(auth, function(error, response) {
        if (error) throw new Error(error)
        let db = new JSONdb('./cache.json');

        db.JSON({cache:true,
            cacheTimeOut: setTimeOut(3).toString(),
            token: JSON.parse(response.body),
            data: [],
            cart:[]
        });
        db.sync();
        let req = save(resolve => {
            return resolve;
        }).then(resolve => {
            return resolve;
        });
        console.log(req)
    })


app.use('/', indexRouter);
app.use('/properties', propertiesRouter);
    app.use('/search', queriesRouter);
    app.use('/cancellationPolicy', cancel);
app.use('/rooms', roomsRouter);
app.use('/cart', cartRouter);
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
