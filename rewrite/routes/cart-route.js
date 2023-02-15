const express = require('express');
const {isEmpty, cancellationPolicy, generateCancellationPolicy, removeFromCart} = require("../functions/functions");
const dayjs = require("dayjs");
const {getToken, checkAuth} = require("../auth/authorization");
const axios = require("axios");
const {response} = require("express");
const request = require("request");
const router = express.Router();
router.post('/valid', function (req, res, next) {
    if(checkAuth(req.header('Authorization'))) {
        getToken().then(function (results) {
            let token = results;
            var date1 = new Date(req.body.startDate);
            var date2 = new Date(req.body.endDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            let body = {
                "bookingRooms": [
                    {
                        "endDate": req.body.endDate,
                        "name": req.body.name,
                        "notes": '',
                        "pax": req.body.numberOfPeople,
                        "numberOfNights": numberOfNights,
                        "quantity": req.body.quantity,
                        "roomId": req.body.roomId,
                        "startDate": req.body.startDate,
                    }
                ],
                "confirm": false,
                "instant": true,
                "name": req.body.hotelname,
                "notes": req.body.notes,
                "propertyId": req.body.propertyId
            }
            let axios = require('axios');
            let config = require('./config.json').valid_cart;
            config.headers.Authorization = "Bearer " + token.access_token;
            config.data = JSON.stringify(body);

            axios(config)
                .then(function (response) {
                    res.send({
                        message: "Successfully added to Cart",
                        data: response.data,
                        status: true
                    })
                    return response.data;
                }).then(function (result) {
                removeFromCart(token,result.id).then(function(success) {
                }).catch(function(e){
                    console.log(e);
                })
            }).catch(function (e) {
                res.send({
                    message: e.response.data.debugMessage,
                    status: false,
                    data: ""
                })
            })
        })
    }
    else {
        res.sendStatus(401)
    }

});
router.post('/confirm', function (req, res, next) {
    if(checkAuth(req.header('Authorization'))) {
        getToken().then(function (results) {
            let token = results;
            var options = {
                "method": "post",
                "url": "https://-api.travia.is/api/v1/travelAgents/1665/bookingCarts",
                "headers": {
                    "Authorization": "Bearer " + token.access_token,
                    "Content-Type": "application/json",

                },
                "body":     {

                }
            };
            var bookings=[]
            console.log(options)
            req.body.bookings.sort((a, b) => {
                return a.propertyId - b.propertyId;
            });
            var bookingRooms = [];

            for (var i = 0; i < req.body.bookings.length; i++) {
                var date1 = new Date(req.body.bookings[i].startDate);
                var date2 = new Date(req.body.bookings[i].endDate);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (i !== 0) {
                    if (!(req.body.bookings[i].propertyId === req.body.bookings[i - 1].propertyId)) {
                        bookings.push({
                            rooms: bookingRooms,
                            propertyId: parseInt(req.body.bookings[i - 1].propertyId)
                            ,
                            bookingCartId:parseInt(req.body.bookings[i].bookingCartId),
                            name:req.body.bookings[i].name

                        })
                        bookingRooms = [];

                        bookingRooms.push(req.body.bookings[i])
                    } else {
                        bookingRooms.push(
                            {
                                endDate: req.body.bookings[i].endDate,
                                name: req.body.bookings[i].name,
                                notes: req.body.bookings[i].notes,
                                pax: parseInt(req.body.bookings[i].pax),
                                numberOfNights: numberOfNights,
                                roomId: parseInt(req.body.bookings[i].roomId),
                                startDate: req.body.bookings[i].startDate,
                                quantity: parseInt(req.body.bookings[i].quantity),
                            })
                    }
                } else {
                    bookingRooms.push(
                        {
                            endDate: req.body.bookings[i].endDate,
                            name: req.body.bookings[i].name,
                            notes: req.body.bookings[i].notes,
                            pax: parseInt(req.body.bookings[i].pax),
                            numberOfNights: numberOfNights,
                            roomId: parseInt(req.body.bookings[i].roomId),
                            startDate: req.body.bookings[i].startDate,
                            quantity: parseInt(req.body.bookings[i].quantity),
                        })
                }

                if(bookingRooms.length === req.body.bookings.length){
                    if(bookingRooms.length === 1)   {
                        bookings.push({
                            rooms: bookingRooms,
                            propertyId: parseInt(req.body.bookings[i].propertyId)          ,
                            bookingCartId:parseInt(req.body.bookings[i].bookingCartId),
                            name:req.body.bookings[i].name

                        })
                    }
                    else {
                        bookings.push({
                            rooms: bookingRooms,
                            propertyId: parseInt(req.body.bookings[i - 1].propertyId)          ,
                            bookingCartId:parseInt(req.body.bookings[i].bookingCartId),
                            name:req.body.bookings[i].name

                        })
                    }

                }
            }
            for (var i = 0; i < bookings.length; i++) {

                options.url = "https://-api.travia.is/api/v1/travelAgents/1665/bookingCarts/" + bookings[i].bookingCartId.toString()
                options.method = "delete"
                options.body = ''
                request(options, function (error, response) {
                    console.log(response)
                })
                options.method = "post"

                options.url = "https://-api.travia.is/api/v1/travelAgents/1665/bookingCarts?createNewBookingCart=true";


                options.body = {

                    bookingRooms: bookings[i].rooms,
                    notes: req.body.notes,
                    propertyId: bookings[i].propertyId,
                    name:bookings[i].name,
                    instant: true,
                    confirm: true
                }
                if (i === 0) {
                }
                options.body = JSON.stringify(options.body)

                request(options, function (error, response) {
                    response.body = JSON.parse(response.body)
                    console.log(response.body)
                    return response.body
                })
            }

            res.send()
        })
    }
    else {
        res.sendStatus(401)
    }

});
router.post('/', function (req, res, next) {
    if(checkAuth(req.header('Authorization'))) {
        getToken().then(function (results) {
            let token = results;
            var date1 = new Date(req.body.startDate);
            var date2 = new Date(req.body.endDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            let body = {
                "bookingRooms": [
                    {
                        "endDate": req.body.endDate,
                        "name": req.body.name,
                        "notes": '',
                        "pax": req.body.numberOfPeople,
                        "numberOfNights": numberOfNights,
                        "quantity": req.body.quantity,
                        "roomId": req.body.roomId,
                        "startDate": req.body.startDate,
                    }
                ],
                "confirm": false,
                "instant": true,
                "name": req.body.hotelname,
                "notes": req.body.notes,
                "propertyId": req.body.propertyId
            }
            let axios = require('axios');
            let config = require('./config.json').valid_cart;
            config.headers.Authorization = "Bearer " + token.access_token;
            config.data = JSON.stringify(body);

            axios(config)
                .then(function (response) {
                    res.send({
                        message: "Successfully added to Cart",
                        data: response.data,
                        status: true
                    })
                    return response.data;
                }).catch(function(e){
                    console.log(e);
                })
            }).catch(function (e) {
                res.send({
                    message: e.response.data.debugMessage,
                    status: false,
                    data: ""
                })
            })
    }
    else {
        res.sendStatus(401)
    }

});

module.exports = router;
