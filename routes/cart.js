var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
const request1 = require("request");

const auth = require("./auth");
var router = express.Router();


router.get('/:cartId', function(req, res, next) {
    if(!req.query.booking) {
        var db = new JSONdb('./cache.json');
        var auth = require('./auth.js');
        request(auth, function(error, response) {
            if (error) throw new Error(error)
            db.set('token',JSON.parse(response.body));
            db.sync();
            var token = db.get('token')
            var options = {
                'method': 'post',
                'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/' + req.params.cartId, /* Check if new cart*/
                'headers': {
                    'Authorization': 'Bearer ' + token.access_token,
                    'Content-Type': 'application/json',

                },
                'body': {}
            };
            request1(options, function (error, response) {
                response.body = JSON.parse(response.body)
                console.log(response.body)
                if(!(response.statusCode === 200))
                    res.send(response.body)
            });
        })

    }
});
router.use( function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var auth = require('./auth.js');
    request(auth, function(error, response) {
        if (error) throw new Error(error)
        db.set('token',JSON.parse(response.body));
        db.sync();
        next();
    })
});
router.post('', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./cache.json');
    var token = db.get('token');
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts?createNewBookingCart=true', /* Check if new cart*/
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
            var booking = {
                name: '',
                totalQuantity:'',
                totalPrice:'',
                totalPax:'',
                totalOriginalPrice:'',
                dateCreated: '',
                startDate:req.body.startDate,
                endDate:req.body.endDate,
                cartId: '',
                valid: false,
                propertyId:req.body.propertyId,
            };
                booking.totalQuantity = response.body.bookings[0].totalQuantity

                booking.totalPrice= response.body.bookings[0].totalPrice

                booking.totalPax = response.body.bookings[0].totalPax

                booking.totalOriginalPrice = response.body.bookings[0].totalOriginalPrice

                booking.dateCreated = response.body.bookings[0].dateCreated

            booking.name = response.body.bookings[0].name + " - FROM:[" + response.body.bookings[0].startDate + "] TO: [" + response.body.bookings[0].endDate + "]"
            booking.cartId = response.body.bookings[0].bookingCartId
            booking.valid = true
            console.log(booking)
            res.send(booking)
        }
        else {
            res.send({valid:false})
        }
    })
});
router.post('/:cartId/confirm', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./cache.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/'+ req.params.cartId + '/confirm',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        if(response.statusCode===200||response.statusCode===201) {
            res.send({valid:true})
        }
        else {
            res.send({valid:false})
        }
    })
});

router.post('/:cartId/valid', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./cache.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/'+ req.params.cartId ,
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        if(response.statusCode===200||response.statusCode===201) {
            res.send({valid:true})
        }
        else {
            res.send({valid:false})
        }
    })
});

router.delete('/:cartId', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./cache.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/'+ req.params.cartId,
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        if(response.statusCode < 400) {
            res.send({valid:true})
        }
        else {
            res.send({valid:false})
        }
    })
});

router.put('/cancel/:cartId', function(req, res, next) {
    console.log(req.body);

    var db = new JSONdb('./cache.json');
    var token = db.JSON();
    var options = {
        'method': 'post',
        'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/'+ req.params.cartId,
        'headers': {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',

        },
        'body': {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        if(response.statusCode < 400) {
            res.send({valid:true})
        }
        else {
            res.send({valid:false})
        }
    })
});

module.exports = router;

