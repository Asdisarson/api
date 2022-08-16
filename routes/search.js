var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
var router = express.Router();
router.get('', function(req, res, next) {
    var db = new JSONdb('./cache.json');
    var auth = require('./auth.js');
    request(auth, function(error, response) {
        if (error) throw new Error(error)
        db.set('token',JSON.parse(response.body));
        db.sync();
    })
    next();

});
router.get('', function(req, res, next) {
    var data ={
        "start": "",
        "end": "",
        "showPropertiesWithoutCooperation": false
    }
    if(req.query||req.bodyUsed) {
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

        if (req.query.end) {
            data.end =  req.query.end;
            data.end = data.end.replace('.','-')
        }

        if (req.query.start) {
            data.start = req.query.start;
            data.start = data.start.replace('/./g', '/-/g')
        }
        if (req.query.numberOfPeople) {
            data["numberOfPeople"] =  req.query.numberOfPeople;
        }
        if (req.query.numberOfExtraBeds) {
            data["numberOfExtraBeds"] = req.query.numberOfExtraBeds;
        }
        if (req.query.numberOfRooms) {
            data["numberOfRooms"] = req.query.numberOfRooms;
        }

        if (req.query.latitude) {
            data["latitude"] = req.query.latitude;
        }

        if (req.query.longitude) {
            data["longitude"] =  req.query.longitude;
        }

        if(req.query.propertyId) {
            data['propertyIds'] = [req.query.propertyId]
        }
        options.body = JSON.stringify(data)
        request(options, function (error, response) {
            var array = {
                query:req.query,
                result: []
            }
            if (error) throw new Error(error)
            response.body = JSON.parse(response.body)
            for (var k = 0; k < response.body.length; k++) {

                data = {
                    startDate: req.query.start,
                    endDate: req.query.end,
                    link: "propertyId:"+response.body[k].id + ";",
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
                    additionalDescription:response.body[k].additionalDescription
                    ,rooms: [

                    ]
                }
                if(req.query.start) {
                    data.link = data.link + "start:" + req.query.start + ";";
                }
                if(req.query.end) {
                    data.link = data.link + "end:" + req.query.end + ";";
                }
                if(req.query.numberOfPeople) {
                    data.link = data.link + "numberOfPeople:" + req.query.numberOfPeople + ";";
                }
                if(req.query.numberOfRooms) {
                    data.link = data.link + "numberOfRooms:" + req.query.numberOfRooms + ";";
                }

                for (var i = 0; i < response.body[k].images.length; i++) {
                    if((i+1) === response.body[k].images.length) {
                        data.featuredImage = response.body[k].images[i].filePath

                    }
                    data.gallery.push(response.body[k].images[i].filePath)
                }
                for (var i = 0; i < response.body[k].rooms.length; i++) {
                    var room = {

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
                        featuredImage: "",
                        gallery: [],
                        roomAddonCategories:[],
                        booking:''
                    }
                    var addons = [];
                    var gallery = [];
                    if (room.availabilityChecked && req.query.start  &&req.query.end && req.query.numberOfRooms&& req.query.numberOfPeople) {
                        room.booking = "cart/?add-to-cart=1209&propertyId="+response.body[k].rooms[i].propertyId+
                            "&roomId="+response.body[k].rooms[i].id+"&product_id=1209"+ "&startDate=" +
                            req.query.start + "&endDate" + req.query.end +
                            "&numberOfRooms=" + req.query.numberOfRooms +  "&name=" + response.body[k].name + "-" + room.name + "&numberOfPeople=" + req.query.numberOfPeople
                        + "&quantity=1"
                    }


                    if(response.body[k].rooms[i].images[0]) {
                        room.featuredImage = response.body[k].rooms[i].images[0].filePath;
                    }
                    if(response.body[k].rooms[i].gallery){
                        for (let j = 0; j < response.body[k].rooms[i].gallery.length; j++) {
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
                    data.rooms.push(room)
                }

                array.result.push(
                    data
                );
            }


            res.send(array);

        })
    }
})
module.exports = router;
