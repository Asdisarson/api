var express = require('express');
var router = express.Router();
var request = require('request');
const JSONdb = require("simple-json-db");

/* GET users listing. */
router.get('/', function(req, res, next) {
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
    }
    if (req.query.propertyId) {
        options.url = options.url + '&propertyId='+req.query.propertyId;
    }
    if (req.query.numberOfExtraBeds) {
        options.url = options.url + '&numberOfExtraBeds=' + req.query.numberOfExtraBeds;
    }
    if (req.query.numberOfRooms) {
        options.url = options.url + '&numberOfRooms='+req.query.numberOfRooms;
    }
    if (req.query.roomIds) {
        options.url = options.url + '&roomIds='+req.query.roomIds;
    }
    if (req.query.end) {
        options.url = options.url + '&end='+req.query.end;
    }
    if (req.query.start) {
        options.url = options.url + '&start='+req.query.start;
    }
    if (req.query.numberOfPeople) {
        options.url = options.url + '&numberOfPeople='+req.query.numberOfPeople;
    }
    if (req.query.numberOfExtraBeds) {
        options.url = options.url + '&numberOfExtraBeds='+req.query.numberOfExtraBeds;
    }
    request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
        res.send(response.body);
    });
});

module.exports = router;
