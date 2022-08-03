var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
const {save} = require("./request");
var router = express.Router();
router.get('', function(req, res, next) {
    var db = new JSONdb('./db.json');
    var cached = db.JSON();
    if(cached.cache)  {
        next();
    }
    else {
        save();
            next()

    }
});
router.get('', function(req, res, next) {
    var db = new JSONdb('./data.json');
    var data = db.JSON();
    var result = data.data.find(obj => {
        return obj.hotelId.toString() === req.query.hotelId;
    });
    res.send({
        data:result.rooms
    });
});
router.get('/:hotelId', function(req, res, next) {
    var db = new JSONdb('./db.json');
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
    var result = data.data.find(obj => {
        return obj.hotelId.toString() === req.params.hotelId;
    });
    res.send({
        data:result.rooms
    });
});
/* GET users listing.
router.get('/:id', function(req, res, next) {
  /*  var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'GET',
        'url': 'https://stage-api.travia.is/api/v1/properties/'+ req.params.id + '/rooms',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
     request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
         console.log(response.body);
         var array = {
             result : []}
         array.result.push(
             JSON.parse(response.body)
         );

         res.send(array);    });


         });*/
module.exports = router;
