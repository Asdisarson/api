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
        if(req.query.duration) {
            req.query['start'] = req.query.duration[0]
            req.query['end'] = req.query.duration[1]
        }
        if (req.query.end) {
            data.end =  req.query.end;
            data.end = new Date(req.query.end*1000)
            data.end = data.end.toISOString().substring(0,10)
            linkendDate = data.end

        }

        if (req.query.start) {
            data.start = req.query.start;
            data.start = new Date(req.query.start*1000)
            data.start = data.start.toISOString().substring(0, 10)
            linkstartDate = data.start
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
                req:options,
                result: []
            }

            if (error) throw new Error(error)
            response.body = JSON.parse(response.body)
            for (var k = 0; k < response.body.length; k++) {

                data = {
                    query:JSON.stringify(req.query),
                    req:JSON.stringify(options),
                    startDate: '',
                    endDate: '',
                    link: '',
                    checkInStartTime: '',
                    checkInEndTime:'',
                    propertyAmenityNames: '',
                    pricesFrom:'',
                    pricesFromCurrencySymbol:'',
                    featuredImage: '',
                    gallery: [],
                    latitude: '',
                    longitude: '',
                    hotelId:'',
                    name:'',
                    propertyType:'',
                    email: '',
                    url: '',
                    phone: '',
                    address: '',
                    postalCode: '',
                    city: '',
                    country: '',
                    description: '',
                    additionalDescription:''
                    ,rooms: [

                    ]
                }

                if(req.query.start) {
                    data.startDate = req.query.start
                }
                if(req.query.end) {
                    data.endDate = req.query.end
                }
                if(response.body[k].id) {
                    data.link = "propertyId:"+response.body[k].id + ";"
                    data.id = response.body[k].id
                }
                if(response.body[k].checkInStartTime) {
                    data.checkInStartTime =response.body[k].checkInStartTime;
                }
                if(response.body[k].checkInEndTime) {
                    data.checkInEndTime =response.body[k].checkInEndTime;
                }
                if(response.body[k].propertyAmenityNames) {
                    data.propertyAmenityNames =response.body[k].propertyAmenityNames;
                }
                if(response.body[k].pricesFrom) {
                    data.pricesFrom =response.body[k].pricesFrom;
                }
                if(response.body[k].pricesFromCurrencySymbol) {
                    data.pricesFromCurrencySymbol =response.body[k].pricesFromCurrencySymbol;
                }
                if(response.body[k].location.geoPoint.lat) {
                    data.latitude =response.body[k].location.geoPoint.lat;
                }
                if(response.body[k].location.geoPoint.lat) {
                    data.longitude =response.body[k].location.geoPoint.lat;
                }
                if(response.body[k].name) {
                    data.name =response.body[k].name;
                }
                if(response.body[k].propertyTypeName) {
                    data.propertyTypeName =response.body[k].propertyTypeName;
                }
                if(response.body[k].contact.email) {
                    data.email =response.body[k].contact.email;
                }
                if(response.body[k].contact.url) {
                    data.url =response.body[k].contact.url;
                }
                if(response.body[k].contact.phone) {
                    data.phone =response.body[k].contact.phone;
                }
                if(response.body[k].contact.email) {
                    data.email =response.body[k].contact.email;
                }
                if(response.body[k].location.address) {
                    data.address =response.body[k].location.address;
                }
                if(response.body[k].location.postalCode) {
                    data.postalCode =response.body[k].location.postalCode
                }
                if(response.body[k].location.city) {
                    data.city =response.body[k].location.city;
                }
                if(response.body[k].location.country) {
                    data.country =response.body[k].location.country;
                }
                if(response.body[k].description) {
                    data.description =response.body[k].description;
                }
                if(response.body[k].additionalDescription) {
                    data.additionalDescription =response.body[k].additionalDescription;
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
                        averageDailyPrice: response.body[k].rooms[i].averageDailyPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        price: response.body[k].rooms[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
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
                        totalBreakfastPrice: response.body[k].rooms[i].totalBreakfastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        totalOriginalBreakfastPrice: response.body[k].rooms[i].totalOriginalBreakfastPrice,
                        extraBedPrice: response.body[k].rooms[i].extraBedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                        extraBedOriginalPrice: response.body[k].rooms[i].extraBedOriginalPrice,
                        featuredImage: "",
                        gallery: [],
                        roomAddonCategories:[],
                        booking:'',
                    }
                    var addons = [];
                    var gallery = [];
                    if (room.availabilityChecked && req.query.start  &&req.query.end && req.query.numberOfPeople) {
                        room.booking = "?add-to-cart=1209&propertyId="+response.body[k].rooms[i].propertyId+
                            "&roomId="+response.body[k].rooms[i].id+"&product_id=1209"+ "&startDate=" +
                            linkstartDate + "&endDate=" + linkendDate +  "&name=" + response.body[k].name + "-" + room.name + "&numberOfPeople=" + req.query.numberOfPeople
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

            if(array.result.length === 0) {
                array.result.push({
                    query:JSON.stringify(req.query),
                    req:JSON.stringify(options),
                    startDate: '',
                    endDate: '',
                    link: '',
                    checkInStartTime: '',
                    checkInEndTime:'',
                    propertyAmenityNames: '',
                    pricesFrom:'',
                    pricesFromCurrencySymbol:'',
                    featuredImage: '',
                    gallery: [],
                    latitude: '',
                    longitude: '',
                    hotelId:'',
                    name:'',
                    propertyType:'',
                    email: '',
                    url: '',
                    phone: '',
                    address: '',
                    postalCode: '',
                    city: '',
                    country: '',
                    description: '',
                    additionalDescription:''
                    ,rooms: [

                    ]
                })
            }
            res.send(array);

        })


})
module.exports = router;
