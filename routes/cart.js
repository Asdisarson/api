var express = require("express");
const JSONdb = require("simple-json-db");
const request = require("request");
const request1 = require("request");
const auth = require("./auth");

var router = express.Router();


router.use(function (req, res, next) {
    var db = new JSONdb("./cache.json");
    var auth = require("./auth.js");
    request(auth, function (error, response) {
        if (error) throw new Error(error)
        db.set("token", JSON.parse(response.body));
        db.sync();
        next();
    })
});


router.get("/:cartId", function (req, res, next) {
    console.log(req.body, req.params.cartId);

    var db = new JSONdb("./cache.json");
    var token = db.get("token");
    var options = {
        "method": "get",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/" + req.params.cartId, /* Check if new cart*/
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {}
    };
    options.body = req.body;
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        console.log(response.body)
        res.send(response.body)
    })
});


router.post("/", function (req, res, next) {
    console.log(req.body);

    var db = new JSONdb("./cache.json");
    var token = db.get("token");
    var options = {
        "method": "post",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts?createNewBookingCart=true",
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {}
    };

    options.body = {
        "bookingRooms": [
            {
                "endDate": req.body.endDate,
                "name": req.body.name,
                "notes": '',
                "pax": req.body.numberOfPeople,
                "numberOfNights": req.body.numberOfNights,
                "quantity": req.body.quantity,
                "roomId": req.body.roomId,
                "startDate": req.body.startDate,
            }
        ],
        "confirm": false,
        "instant": true,
        "name": req.body.name,
        "notes": req.body.notes,
        "propertyId": req.body.propertyId
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        console.log(options.url);
            response.body = JSON.parse(response.body)
            console.log(response.body)
            res.send(response.body.bookings)

        }
    )

})
;

router.post("/confirm", function (req, res, next) {

    console.log(req.body);
    db = new JSONdb("./cache.json");
    var token = db.get("token");
    var options = {
        "method": "post",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts",
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {

        }
    };

    console.log(options)
    for (var i = 0; i < req.body.bookings.length; i++) {
        options.url = "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts"

        var date1 = new Date(req.body.bookings[i].startDate);
            var date2 = new Date(req.body.bookings[i].endDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            options.body = {

                    bookingRooms: [
                        {
                            endDate: req.body.bookings[i].endDate,
                            name: req.body.bookings[i].name,
                            notes: req.body.bookings[i].notes,
                            pax: parseInt(req.body.bookings[i].pax),
                            numberOfNights:numberOfNights,
                            roomId: parseInt(req.body.bookings[i].roomId),
                            startDate: req.body.bookings[i].startDate,
                                quantity: parseInt(req.body.bookings[i].quantity),

                        }
                    ],
                notes: req.body.notes,

                propertyId:parseInt( req.body.bookings[i].propertyId),
                    name: req.body.name,
                    instant: true,
                    confirm:false
                }
                if(i === 0) {
                    options.url = "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts?createNewBookingCart=true";
                }
            if (req.body.bookings.length === (i + 1)) {

                options.body.confirm = true;
            }            console.log(options.body)
            options.body = JSON.stringify(options.body)

            request(options, function (error, response) {
                response.body = JSON.parse(response.body)
                console.log(response.body)
                   return response.body
            })

        }
          res.send()
});

router.post("/:cartId/valid", function (req, res, next) {
    console.log(req.body);

    var db = new JSONdb("./cache.json");
    var token = db.JSON();
    var options = {
        "method": "post",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/" + req.params.cartId,
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        console.log(response.body)
        res.send(response.body)
    })
});

router.delete("/:cartId", function (req, res, next) {
    console.log(req.body);

    var db = new JSONdb("./cache.json");
    var token = db.JSON();
    var options = {
        "method": "post",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/" + req.params.cartId,
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        console.log(response.body)
        res.send(response.body)
    })
});

router.put("/:cartId/cancel", function (req, res, next) {
    console.log(req.body);

    var db = new JSONdb("./cache.json");
    var token = db.JSON();
    var options = {
        "method": "post",
        "url": "https://stage-api.travia.is/api/v1/travelAgents/577/bookingCarts/" + req.params.cartId,
        "headers": {
            "Authorization": "Bearer " + token.access_token,
            "Content-Type": "application/json",

        },
        "body": {}
    };
    options.body = JSON.stringify(options.body)
    request(options, function (error, response) {
        response.body = JSON.parse(response.body)
        console.log(response.body)
        res.send(response.body)
    })
});

module.exports = router;
