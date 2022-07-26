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
        "start": "",
        "end": "",
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
        data.end = data.end.replaceAll('.','-')
    }

    if (req.query.start) {
        data.start = req.query.start;
        data.start = data.start.replaceAll('.', '-')
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
                query:req.query
                ,
                result: []
            }
            if (error) throw new Error(error)
            console.log(response.body);
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

                ],
            }

                if(req.query.start) {
                    data.link = data.link + "start:" + req.query.start + ";";
                }
                if(req.query.end) {
                    data.link = data.link + "end:" + req.query.end + ";";
                }
                if(req.query.end) {
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
                if (room.availabilityChecked && req.query.start  &&req.query.end && req.query.numberOfRooms) {
                    room.booking = "cart/?add-to-cart=1209&propertyId="+response.body[k].rooms[i].propertyId+
                    "&roomId="+response.body[k].rooms[i].id+"&product_id=1209"+ "&startDate=" +
                        req.query.start + "&endDate" + req.query.end +
                        "&quantity=" + req.query.numberOfRooms +  "&name=" + response.body[k].name + "-" + room.name

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
                    startDate: req.query.start,
                    endDate: req.query.end,
                    link: "propertyId:" + response.body[k].id + ";",
                    checkInStartTime: response.body[k].checkInStartTime,
                    checkInEndTime: response.body[k].checkInEndTime,
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
                    additionalDescription: response.body[k].additionalDescription,
                    sameDayBooking: response.body[k].sameDayBooking
                    , rooms: []
                }
                if (req.query.start) {
                    data.link = data.link + "start:" + req.query.start + ";";
                }
                if (req.query.end) {
                    data.link = data.link + "end:" + req.query.end + ";";
                }
                if (req.query.end) {
                }
                for (var i = 0; i < response.body[k].images.length; i++) {
                    if ((i + 1) === response.body[k].images.length) {
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
                        roomAddonCategories: [],
                    }
                    var addons = [];
                    var gallery = [];
                    if (room.availabilityChecked) {
                        room['booking'] = "cart/?add-to-cart=14&propertyId=" + response.body[k].rooms[i].propertyId +
                            "&roomId=" + response.body[k].rooms[i].id + "&product_id=14" +
                            "&propertyAddress=" + response.body[k].location.address + "&countryId=" +
                            response.body[k].location.country + "&startDate=" +
                            req.query.start + "&endDate" + req.query.end

                    }
                    if (response.body[k].rooms[i].images[0]) {
                        room.featuredImage = response.body[k].rooms[i].images[0].filePath;
                    }
                    if (response.body[k].rooms[i].gallery) {
                        for (let j = 0; j < response.body[k].rooms[i].gallery.length; j++) {
                            gallery.push(response.body[k].rooms[i].gallery[j].filePath);
                        }
                    }

                    room.gallery = gallery;
                    for (let j = 0; j < response.body[k].rooms[i].roomAddonCategories.length; j++) {
                        addons.push({
                            name: response.body[k].rooms[i].roomAddonCategories[j].name,
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
    }    else {
        res.sendStatus(503)
    }
});

module.exports = router;
