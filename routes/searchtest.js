var express = require('express');
var router = express.Router();

const JSONdb = require("simple-json-db");
const request = require("request");

router.get('', function (req, res, next) {
    var db = new JSONdb('./cache.json');
    var auth = require('./auth.js');
    request(auth, function (error, response) {
        if (error) throw new Error(error)
        db.set('token', JSON.parse(response.body));
        db.sync();
        next();

    })

});
router.get('', function (req, res, next) {
    try {
         var newArray = [];
        var data = {
            "start": "",
            "end": "",
            "showPropertiesWithoutCooperation": false
        }
        var linkstartDate = ''
        var linkendDate = ''
        var db = new JSONdb('./cache.json');
        var token = db.get('token');
        var options = {
            'method': 'post',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/search',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',

            },
            'body': ''
        };





        if (req.query.duration) {
            req.query['start'] = req.query.duration[0]
            req.query['end'] = req.query.duration[1]
        }
        if (req.query.end) {
            data.end = req.query.end;
            data.end = new Date(req.query.end * 1000)
            data.end = data.end.toISOString().substring(0, 10)

        }

        if (req.query.start) {
            data.start = req.query.start;
            data.start = new Date(req.query.start * 1000)
            data.start = data.start.toISOString().substring(0, 10)
        }




        options.body = JSON.stringify(data)
        request(options, function (error, response) {

            var array = {
                result: []
            }

            if (error) throw new Error(error)
            response.body = JSON.parse(response.body)
            for (var k = 0; k < response.body.length; k++) {

                data = {
                    link: '',
                    propertyAmenityNames: '',
                    pricesFrom: '',
                    featureImage: '',
                    name: '',
                    city: ''
                }


                if (response.body[k].id) {
                    data.link = "propertyId:" + response.body[k].id + ";"
                }

                if (response.body[k].pricesFrom) {
                    data.pricesFrom = response.body[k].pricesFrom;
                }

                if (response.body[k].name) {
                    data.name = response.body[k].name;
                }
                if (response.body[k].location.city) {
                    data.city = response.body[k].location.city;
                }
                if (response.body[k].propertyAmenityNames) {
                    data.propertyAmenityNames = response.body[k].propertyAmenityNames;
                }
                if (req.numberOfRooms && req.query.start && req.query.end && req.query.numberOfPeople) {
                    data.link = data.link + "start:" + req.query.start + ";";
                    data.link = data.link + "end:" + req.query.end + ";";
                    data.link = data.link + "numberOfPeople:" + req.query.numberOfPeople + ";";
                    data.link = data.link + "numberOfRooms:1;";
                }

                for (var i = 0; i < response.body[k].images.length; i++) {
                    if (response.body[k].images[i]) {
                        data.featureImage = response.body[k].images[i].filePath
                    }
                }


                array.result.push(
                    data
                );
                if(req.query.propertyId) {
                    res.send(array);
                }
            }

            console.log(JSON.stringify(array))
            if (array.result.length === 0) {
                next()

            }
            else {

                res.send(array);
            }

        })
    }
    catch (e) {
        console.log(e);
        next();
    }
})
const {save} = require("./request");
const {getHotelCache} = require("./cache");
const auth = require("./auth");

/* GET users listing. */

router.get('', function (req, res, next){
    if(req.query.hotelId) {

        res.send({
            data:getHotelCache(req.query.hotelId)
        });}

    else{
        next();
    }
})
router.get('', function (req, res, next){
    var data = new JSONdb('./cache.json');
    var output = data.get('data');
    console.log(output)
    if(output.length > 0){
        res.send({result:output});
    }
    else {
        save()
        res.send({result:[{
                query: "",
                req:"",
                startDate: '',
                endDate: '',
                link: '',
                checkInStartTime: '',
                checkInEndTime: '',
                propertyAmenityNames: '',
                pricesFrom: '',
                pricesFromCurrencySymbol: '',
                featureImage: '',
                gallery: [],
                latitude: '',
                longitude: '',
                hotelId: '',
                name: '',
                propertyType: '',
                email: '',
                url: '',
                phone: '',
                address: '',
                postalCode: '',
                city: '',
                country: '',
                description: '',
                additionalDescription: ''
                , rooms: [],
                information:{}
            }]})
    }
})
module.exports = router;
