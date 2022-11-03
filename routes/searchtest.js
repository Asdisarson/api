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

const {save} = require("./request2");
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
