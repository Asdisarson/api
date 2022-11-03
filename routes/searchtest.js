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


                array.result = [
                    {
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    },{
                        "link": "propertyId:115;",
                        "propertyAmenityNames": [
                            "Air conditioning",
                            "Bar",
                            "24 hour front desk",
                            "Business Center"
                        ],
                        "pricesFrom": 12214.499999999998,
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2021-10-14T01:11:54_98f68b14-3bb4-4a23-a184-bad5f8bb1a1e_1246280_16061017110043391702.jpg",
                        "name": "Travia Stage (NET) API Test ",
                        "city": "Reykjavík"
                    },
                    {
                        "link": "propertyId:4;",
                        "propertyAmenityNames": [],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2019-05-29T10:19:16_b6a1249c-918a-4cd4-a1e5-d486c55df3b3_all3.png",
                        "name": "Travia demo hotel",
                        "city": "Reykjavik"
                    },
                    {
                        "link": "propertyId:530;",
                        "propertyAmenityNames": [
                            "24 hour front desk",
                            "Room service",
                            "Gym",
                            "Business Center"
                        ],
                        "pricesFrom": "",
                        "featureImage": "https://s3-eu-west-1.amazonaws.com/images-stage-app.travia.is/2022-08-18T03:41:29_6b41dc6a-3dca-4309-9e3e-589ad56d15a6_80327914.jpg",
                        "name": "Nice Hotel",
                        "city": "Akureyri"
                    }
                ];
                if(req.query.propertyId) {
                    res.send(array);
                }
            }

            console.log(JSON.stringify(array))
            if (array.result.length === 0) {
                next()

            }
            else {

                res.send();
            }

        })

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
