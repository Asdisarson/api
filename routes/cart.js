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
            res.send({
                totalQuantity:response.body.bookings[0].totalQuantity,
                totalPrice:response.body.bookings[0].totalPrice,
                totalPax:response.body.bookings[0].totalPax,
                totalOriginalPrice:response.body.bookings[0].totalOriginalPrice,
                cartId:response.body.bookings[0].bookingCartId,
                dateCreated:response.body.bookings[0].dateCreated,
                name: response.body.bookings[0].name + " - FROM:[" + response.body.bookings[0].startDate + "] TO: [" + response.body.bookings[0].endDate + "]" ,
                valid:true
            })
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
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts?createNewBookingCart=true',
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

