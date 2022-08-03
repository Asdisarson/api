var express = require('express');
var router = express.Router();
var request = require('request');
const JSONdb = require("simple-json-db");

/* GET users listing. */
router.get('', function(req, res, next) {

    if(req.query||req.body) {
        next();
    }
    else{
        res.send({})
    }

})
router.get('', function(req, res, next) {
    var data ={
        "start": "",
        "end": "",
        "latitude": 0,
        "longitude": 0,
        "numberOfPeople": 1,
        "numberOfRooms": 1,
        "showPropertiesWithoutCooperation": false
    }
    if(req.query||req.bodyUsed) {
        var db = new JSONdb('./db.json');
        var token = db.JSON();
        var options = {
            'method': 'post',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/search',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',

            },
            'body': ''
        };


    if (req.query.end) {
        data.end =  req.query.end;
    }
     if (req.body.end) {
        data.end =  req.body.end;
    }
    if (req.query.start) {
        data.start = req.query.start;
    }
     if (req.body.start) {
        data.start =  req.body.start;
    }
    if (req.query.numberOfPeople) {
        data.numberOfPeople =  req.query.numberOfPeople;
    }
     if (req.body.numberOfPeople) {
        data.numberOfPeople =  req.body.numberOfPeople;
    }
    if (req.query.numberOfExtraBeds) {
        data.numberOfExtraBeds = req.query.numberOfExtraBeds;
    }
     if (req.body.numberOfExtraBeds) {
        data.numberOfExtraBeds =  req.body.numberOfExtraBeds;
    }
    if (req.query.latitude) {
        data.latitude = req.query.latitude;
    }
     if (req.body.latitude) {
        data.latitude = req.body.latitude;
    }
    if (req.query.longitude) {
        data.longitude =  req.query.longitude;
    }
     if (req.body.longitude) {
        data.longitude =  req.body.longitude;
    }
    options.body = JSON.stringify(data)
        request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            var array = {
                result: []
            }
            array.result.push(
                JSON.parse(response.body)
            );

            res.send(array);

        })
    }
})
router.get('/available', function(req, res, next) {
    var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'GET',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/search/availability',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
    if(req.query) {
        options.url = options.url + '?';

        if (req.query.propertyId) {
            options.url = options.url + '&propertyId=' + req.query.propertyId;
        }
        if (req.query.numberOfExtraBeds) {
            options.url = options.url + '&numberOfExtraBeds=' + req.query.numberOfExtraBeds;
        }
        if (req.query.numberOfRooms) {
            options.url = options.url + '&numberOfRooms=' + req.query.numberOfRooms;
        }
        if (req.query.roomIds) {
            options.url = options.url + '&roomIds=' + req.query.roomIds;
        }
        if (req.query.end) {
            options.url = options.url + '&end=' + req.query.end;
        }
        if (req.query.start) {
            options.url = options.url + '&start=' + req.query.start;
        }
        if (req.query.numberOfPeople) {
            options.url = options.url + '&numberOfPeople=' + req.query.numberOfPeople;
        }
        if (req.query.numberOfExtraBeds) {
            options.url = options.url + '&numberOfExtraBeds=' + req.query.numberOfExtraBeds;
        }
        request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            var array = {
            result : []}
            array.result.push(
                JSON.parse(response.body)
            );

            res.send(array);

}) }
    else {
        res.sendStatus(503)
    }
});

module.exports = router;
