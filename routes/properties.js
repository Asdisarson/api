var express = require('express');
var router = express.Router();
const request = require("request");
const JSONdb = require("simple-json-db");
const {save} = require("./request");

/* GET users listing. */
router.get('', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        save();
        next()
    }
});
router.get('', function (req, res, next){
    if(req.query.hotelId)
    {var db = new JSONdb('./data.json');
        var data = db.JSON();
        var result = data.data.filter(obj => {
            return obj.hotelId.toString() === req.query.hotelId;
        })
        res.send({
            data:result
        });}

   else{
       next();
   }
})
router.get('', function (req, res, next){
    var data = new JSONdb('./data.json');
    console.log(data.JSON());
    res.send(data.JSON());
})

router.get('/', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        save();
        next()
    }
});
router.get('/', function (req, res, next){
    var data = new JSONdb('./data.json');
    console.log(data.JSON());
    res.send(data.JSON());
})
router.get('/:hotelId', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        save();

            next()

    }
});
router.get('/:hotelId', function(req, res, next) {
    var db = new JSONdb('./data.json');
    var data = db.JSON();
    var result = data.data.filter(obj => {
        return obj.hotelId.toString() === req.params.hotelId;
    })
    res.send({
        data:result
    });

});


module.exports = router;
