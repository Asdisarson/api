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
    if (req.params.propertyId) {
        options.url = options.url + '&propertyId='+req.params.propertyId;
    }
    if (req.params.numberOfExtraBeds) {
        options.url = options.url + '&numberOfExtraBeds=' + req.params.numberOfExtraBeds;
    }
    if (req.params.numberOfRooms) {
        options.url = options.url + '&numberOfRooms='+req.params.numberOfRooms;
    }
    if (req.params.roomIds) {
        options.url = options.url + '&roomIds='+req.params.roomIds;
    }
    if (req.params.end) {
        options.url = options.url + '&end='+req.params.end;
    }
    if (req.params.start) {
        options.url = options.url + '&start='+req.params.start;
    }

    request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
        res.send(response.body);
    });
});

module.exports = router;
