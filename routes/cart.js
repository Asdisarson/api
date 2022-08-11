var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
var router = express.Router();

/* GET users listing. */

router.post('/', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = {

        "bookingRooms": [
            {
                "endDate": req.body.endDate,
                "name": req.body.name,
                "quantity": req.body.quantity,
                "roomId": req.body.roomId,
                "startDate": req.body.startDate,
                "pax" : req.body.pax
            }
        ],
        "confirm": false,
        "instant": true,
        "name": req.body.name,
        "propertyId":req.body.propertyId,
    }
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        console.log(response.body)
        if(response.body.bookingCartStatusCode==="OPEN") {
            var booking = {}
            if (response.body.bookings[0].totalQuantity) {
                booking['totalQuantity'] = response.body.bookings[0].totalQuantity
            }
            if (response.body.bookings[0].totalPrice) {
                booking['totalPrice'] = response.body.bookings[0].totalPrice

            }
            if (response.body.bookings[0].totalPax) {
                booking['totalPax'] = response.body.bookings[0].totalPax

            }
            if (response.body.bookings[0].totalOriginalPrice) {
                booking['totalOriginalPrice'] = response.body.bookings[0].totalOriginalPrice

            }
            if (response.body.bookings[0].dateCreated) {
                booking['dateCreated'] = response.body.bookings[0].dateCreated

            }
            booking['name'] = response.body.bookings[0].name + " - FROM:[" + response.body.bookings[0].startDate + "] TO: [" + response.body.bookings[0].endDate + "]"
                booking['cartId'] = response.body.bookings[0].bookingCartId
            booking['valid'] = true
            res.send(booking)
        }
        else {
            res.send({valid:false})
        }
    })
});
router.post('/confirm', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = {

        "bookingRooms": [
            {
                "endDate": req.body.endDate,
                "name": req.body.name,
                "quantity": req.body.quantity,
                "roomId": req.body.roomId,
                "startDate": req.body.startDate,
                "pax" : req.body.pax
            }
        ],
        "confirm": false,
        "instant": true,
        "name": req.body.name,
        "propertyId":req.body.propertyId,
    }
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        if(response.body.bookingCartStatusCode==="OPEN") {
            res.send()
        }
        else {
            res.send({valid:false})
        }
    })
});

module.exports = router;

