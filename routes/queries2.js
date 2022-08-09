var express = require('express');
var router = express.Router();
var request = require('request');
const JSONdb = require("simple-json-db");

/* GET users listing. */
router.get('', function(req, res, next) {

    if(req.query||req.body) {
        next();
    }
    else{
        res.send({})
    }

})
router.get('', function(req, res, next) {
    var data ={
        "latitude": 0,
        "longitude": 0,
        "start": "",
        "end": "",
        "numberOfPeople": 1,
        "numberOfRooms": 1,
        "showPropertiesWithoutCooperation": false
    }
    if(req.query||req.bodyUsed) {
        var db = new JSONdb('./db.json');
        var token = db.JSON();
        var options = {
            'method': 'post',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/search',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',

            },
            'body': ''
        };


        if (req.query.end) {
            data.end =  req.query.end;
            data.end.replace('/./g','-')
        }
        if (req.body.end) {
            data.end =  req.body.end;1
            data.end.replace('/./g','-')

        }
        if (req.query.start) {
            data.start = req.query.start;
            data.end.replace('/./g','-')
        }
        if (req.body.start) {
            data.start =  req.body.start;
            data.end.replace('/./g','-')

        }
        if (req.body.start) {
            data.start =  req.body.start;
        }    if (req.query.numberOfPeople) {
            data.numberOfPeople =  req.query.numberOfPeople;
        }
        if (req.body.numberOfPeople) {
            data.numberOfPeople =  req.body.numberOfPeople;
        }
        if (req.query.numberOfExtraBeds) {
            data.numberOfExtraBeds = req.query.numberOfExtraBeds;
        }
        if (req.body.numberOfExtraBeds) {
            data.numberOfExtraBeds =  req.body.numberOfExtraBeds;
        }
        if (req.query.latitude) {
            data.latitude = req.query.latitude;
        }
        if (req.body.latitude) {
            data.latitude = req.body.latitude;
        }
        if (req.query.longitude) {
            data.longitude =  req.query.longitude;
        }
        if (req.body.longitude) {
            data.longitude =  req.body.longitude;
        }
        if(req.query.propertyId) {
            data['propertyIds'] = [req.query.propertyId]
        }

        options.body = JSON.stringify(data)
        request(options, function (error, response) {
            var array = {
                result: []
            }
            if (error) throw new Error(error)
            console.log(response.body);
            response.body = JSON.parse(response.body)
            for (var k = 0; k < response.body.length; k++) {

                data = {
                    checkInStartTime: response.body[k].checkInStartTime,
                    checkInEndTime:response.body[k].checkInEndTime,
                    propertyAmenityNames: response.body[k].propertyAmenityNames,
                    pricesFrom: response.body[k].pricesFrom,
                    pricesFromCurrencySymbol: response.body[k].pricesFromCurrencySymbol,
                    featuredImage: '',
                    gallery: [],
                    latitude: response.body[k].location.geoPoint.lat,
                    longitude: response.body[k].location.geoPoint.lon,
                    hotelId: response.body[k].id,
                    name: response.body[k].name,
                    propertyType: response.body[k].propertyTypeName,
                    email: response.body[k].contact.email,
                    url: response.body[k].contact.url,
                    phone: response.body[k].contact.phone,
                    address: response.body[k].location.address,
                    postalCode: response.body[k].location.postalCode,
                    city: response.body[k].location.city,
                    country: response.body[k].location.country,
                    description: response.body[k].description,
                    additionalDescription:response.body[k].additionalDescription,
                    isRoom:false,
                    roomId: '',
                    minOccupancy: '',
                    maxOccupancy: '',
                    extraBed: '',
                    extraBedQuantity: '',
                    roomSize: '',
                    propertyId: '',
                    roomTypeName: '',
                    roomCategoryName: '',
                    wholeYearAvailability:'',
                    availabilityChecked: '',
                    available: '',
                    averageDailyPrice: '',
                    price: '',
                    currencyCode: '',
                    currencySymbol: '',
                    availableQuantity: '',
                    discount: '',
                    discountDescription: '',
                    discountsUsed: '',
                    originalCurrencySymbol: '',
                    originalCurrencyCode: '',
                    priceDescription: '',
                    breakfastAvailable: '',
                    breakfastIncluded: '',
                    totalBreakfastPrice: '',
                    totalOriginalBreakfastPrice: '',
                    extraBedPrice: '',
                    extraBedOriginalPrice: '',
                    roomAddonCategories:[],
                }
                for (var i = 0; i < response.body[k].images.length; i++) {
                    if((i+1) === response.body[k].images.length) {
                        data.featuredImage = response.body[k].images[i].filePath

                    }
                    data.gallery.push(response.body[k].images[i].filePath)
                }
                for (var i = 0; i < response.body[k].rooms.length; i++) {
                    var room = {checkInStartTime:'',
                        checkInEndTime:'',
                        propertyAmenityNames: '',
                        pricesFrom: '',
                        pricesFromCurrencySymbol: '',
                        latitude: '',
                        longitude: '',
                        hotelId: '',
                        propertyType: '',
                        email: '',
                        url: '',
                        phone: '',
                        address: '',
                        postalCode:'',
                        city: '',
                        country: '',
                        additionalDescription:'',
                        name: response.body[k].rooms[i].name,
                        roomId: response.body[k].rooms[i].id,
                        description: response.body[k].rooms[i].description,
                        minOccupancy: response.body[k].rooms[i].minOccupancy,
                        maxOccupancy: response.body[k].rooms[i].maxOccupancy,
                        extraBed: response.body[k].rooms[i].extraBed,
                        extraBedQuantity: response.body[k].rooms[i].extraBedQuantity,
                        roomSize: response.body[k].rooms[i].roomSize,
                        propertyId: response.body[k].rooms[i].propertyId,
                        roomTypeName: response.body[k].rooms[i].roomTypeName,
                        roomCategoryName: response.body[k].rooms[i].roomCategoryName,
                        wholeYearAvailability: response.body[k].rooms[i].wholeYearAvailability,
                        availabilityChecked: response.body[k].rooms[i].availabilityChecked,
                        available: response.body[k].rooms[i].available,
                        averageDailyPrice: response.body[k].rooms[i].averageDailyPrice,
                        price: response.body[k].rooms[i].price,
                        currencyCode: response.body[k].rooms[i].currencyCode,
                        currencySymbol: response.body[k].rooms[i].currencySymbol,
                        availableQuantity: response.body[k].rooms[i].availableQuantity,
                        discount: response.body[k].rooms[i].discount,
                        discountDescription: response.body[k].rooms[i].discountDescription,
                        discountsUsed: response.body[k].rooms[i].discountsUsed,
                        originalCurrencySymbol: response.body[k].rooms[i].originalCurrencySymbol,
                        originalCurrencyCode: response.body[k].rooms[i].originalCurrencyCode,
                        priceDescription: response.body[k].rooms[i].priceDescription,
                        breakfastAvailable: response.body[k].rooms[i].breakfastAvailable,
                        breakfastIncluded: response.body[k].rooms[i].breakfastIncluded,
                        totalBreakfastPrice: response.body[k].rooms[i].totalBreakfastPrice,
                        totalOriginalBreakfastPrice: response.body[k].rooms[i].totalOriginalBreakfastPrice,
                        extraBedPrice: response.body[k].rooms[i].extraBedPrice,
                        extraBedOriginalPrice: response.body[k].rooms[i].extraBedOriginalPrice,
                        featuredImage: '',
                        gallery: [],
                        roomAddonCategories:[],
                        isRoom:true,

                    }
                    var addons = [];
                    var gallery = [];
                    if(response.body[k].rooms[i].gallery){
                        for (let j = 0; j < response.body[k].rooms[i].gallery.length; j++) {
                            if((j+1)===response.body[k].rooms[i].gallery.length) {
                                room.featuredImage = response.body[k].rooms[i].gallery[j];
                            }
                            gallery.push(response.body[k].rooms[i].gallery[j].filePath);
                        }
                    }

                    room.gallery = gallery;
                    for (let j = 0; j < response.body[k].rooms[i].roomAddonCategories.length; j++) {
                        addons.push({
                            name :  response.body[k].rooms[i].roomAddonCategories[j].name,
                            addonNames: response.body[k].rooms[i].roomAddonCategories[j].addonNames
                        });
                    }
                    room.addons = addons;
                    array.result.push(
                        room
                    );
                }

                array.result.push(
                    data
                );
            }
            array.result = array.result.reverse()


            res.send(array);

        })
    }
})
router.get('/available', function(req, res, next) {
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

        if (req.query.propertyId) {
            options.url = options.url + '&propertyId=' + req.query.propertyId;
        }
        if (req.query.numberOfExtraBeds) {
            options.url = options.url + '&numberOfExtraBeds=' + req.query.numberOfExtraBeds;
        }
        if (req.query.numberOfRooms) {
            options.url = options.url + '&numberOfRooms=' + req.query.numberOfRooms;
        }
        if (req.query.roomIds) {
            options.url = options.url + '&roomIds=' + req.query.roomIds;
        }
        if (req.query.end) {
            options.url = options.url + '&end=' + req.query.end;
        }
        if (req.query.start) {
            options.url = options.url + '&start=' + req.query.start;
        }
        if (req.query.numberOfPeople) {
            options.url = options.url + '&numberOfPeople=' + req.query.numberOfPeople;
        }
        if (req.query.numberOfExtraBeds) {
            options.url = options.url + '&numberOfExtraBeds=' + req.query.numberOfExtraBeds;
        }
        request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            var array = {
                result : []}
            array.result.push(
                JSON.parse(response.body)
            );

            res.send(array);

        }) }
    else {
        res.sendStatus(503)
    }
});

module.exports = router;
