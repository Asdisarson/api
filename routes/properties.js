var express = require('express');
var router = express.Router();
const request = require("request");
const JSONdb = require("simple-json-db");
const {save} = require("./request");
const options = require("./auth");

/* GET users listing. */
router.get('', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        db = new JSONdb('./data.json');
        request(options, function (error, response) {
            if (error) throw new Error(error)
            var json = JSON.parse(response.body);
            db.JSON(json);
            db.sync()
            res.send(save());
        })}
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
    var output = data.JSON();
    res.send(output);
})

router.get('/', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        db = new JSONdb('./data.json');
        request(options, function (error, response) {
                if (error) throw new Error(error)
                var json = JSON.parse(response.body);
        db.JSON(json);
        db.sync()
        res.send(save());
    })}
});
router.get('/', function (req, res, next){
    var data = new JSONdb('./data.json');
    var output = data.JSON();

    res.send(output);
})
router.get('/:hotelId', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        db = new JSONdb('./data.json');
        request(options, function (error, response) {
            if (error) throw new Error(error)
            var json = JSON.parse(response.body);
            db.JSON(json);
            db.sync()
            res.send(save());
        })}
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
