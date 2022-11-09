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
        linkendDate = data.end

    }

    if (req.query.start) {
        data.start = req.query.start;
        data.start = new Date(req.query.start * 1000)
        data.start = data.start.toISOString().substring(0, 10)
        linkstartDate = data.start
    }

    if (req.query.numberOfPeople) {
        data["numberOfPeople"] = req.query.numberOfPeople;
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
        data["longitude"] = req.query.longitude;
    }

        if (req.query.propertyId) {
            data['propertyIds'] = [req.query.propertyId]
        }

        if (req.query.roomIds) {
            data['roomIds'] = [req.query.roomIds]
        }

    options.body = JSON.stringify(data)
    request(options, function (error, response) {

        var array = {
            query: req.query,
            req: options,
            result: []
        }

        if (error) throw new Error(error)
        response.body = JSON.parse(response.body)
        for (var k = 0; k < response.body.length; k++) {

            data = {
                query: JSON.stringify(req.query),
                req: JSON.stringify(options),
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
                , rooms: []  ,
                cancellationPolicy: []
            }

            if (req.query.numberOfRooms) {
                req.query.numberOfRooms = 1;
            }
            if (req.query.start) {
                data.startDate = req.query.start
            }
            if (req.query.end) {
                data.endDate = req.query.end
            }
            if (response.body[k].id) {
                data.link = "propertyId:" + response.body[k].id + ";"
                data.id = response.body[k].id
            }
            if (response.body[k].checkInStartTime) {
                data.checkInStartTime = response.body[k].checkInStartTime;
            }
            if (response.body[k].checkInEndTime) {
                data.checkInEndTime = response.body[k].checkInEndTime;
            }
            if (response.body[k].propertyAmenityNames) {
                data.propertyAmenityNames = response.body[k].propertyAmenityNames;
            }
            if (response.body[k].pricesFrom) {
                data.pricesFrom = response.body[k].pricesFrom;
            }
            if (response.body[k].pricesFromCurrencySymbol) {
                data.pricesFromCurrencySymbol = response.body[k].pricesFromCurrencySymbol;
            }
            if (response.body[k].location.geoPoint.lat) {
                data.latitude = response.body[k].location.geoPoint.lat;
            }
            if (response.body[k].location.geoPoint.lat) {
                data.longitude = response.body[k].location.geoPoint.lon;
            }
            if (response.body[k].name) {
                data.name = response.body[k].name;
            }
            if (response.body[k].propertyTypeName) {
                data.propertyTypeName = response.body[k].propertyTypeName;
            }
            if (response.body[k].contact.email) {
                data.email = response.body[k].contact.email;
            }
            if (response.body[k].contact.url) {
                data.url = response.body[k].contact.url;
            }
            if (response.body[k].contact.phone) {
                data.phone = response.body[k].contact.phone;
            }
            if (response.body[k].contact.email) {
                data.email = response.body[k].contact.email;
            }
            if (response.body[k].location.address) {
                data.address = response.body[k].location.address;
            }
            if (response.body[k].location.postalCode) {
                data.postalCode = response.body[k].location.postalCode
            }
            if (response.body[k].location.city) {
                data.city = response.body[k].location.city;
            }
            if (response.body[k].location.country) {
                data.country = response.body[k].location.country;
            }
            if (response.body[k].description) {
                data.description = response.body[k].description;
            }
            if (response.body[k].additionalDescription) {
                data.additionalDescription = response.body[k].additionalDescription;
            }
            if (req.query.start) {
                data.link = data.link + "start:" + req.query.start + ";";
            }
            if (req.query.end) {
                data.link = data.link + "end:" + req.query.end + ";";
            }
            if (req.query.numberOfPeople) {
                data.link = data.link + "numberOfPeople:" + req.query.numberOfPeople + ";";
            }
            if (req.query.numberOfRooms) {
                data.link = data.link + "numberOfRooms:1;";
            }

            for (var i = 0; i < response.body[k].images.length; i++) {
                if (response.body[k].images[i]) {
                    data.featureImage = response.body[k].images[i].filePath

                }
                var temp = response.body[k].images[i].filePath;
                data["gallery" + i] = response.body[k].images[i].filePath;

                data.gallery.push(temp)
            }
            data.gallery = data.gallery.reverse();
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
                    averageDailyPrice: parseInt(response.body[k].rooms[i].averageDailyPrice).toLocaleString('de-DE'),
                    price: parseInt(response.body[k].rooms[i].price).toLocaleString('de-DE'),
                    niceDollars: ((parseInt(response.body[k].rooms[i].price) * 0.1).toFixed(0)).toLocaleString('de-DE'),
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
                    totalBreakfastPrice: parseInt(response.body[k].rooms[i].totalBreakfastPrice).toLocaleString('de-DE'),
                    totalOriginalBreakfastPrice: parseInt(response.body[k].rooms[i].totalOriginalBreakfastPrice).toLocaleString('de-DE'),
                    extraBedPrice: parseInt(response.body[k].rooms[i].extraBedPrice).toLocaleString('de-DE'),
                    extraBedOriginalPrice: parseInt(response.body[k].rooms[i].extraBedOriginalPrice).toLocaleString('de-DE')
                    ,
                    featureImage: "",
                    gallery: [],
                    roomAddonCategories: [],
                    booking: '',
                    cancellationPolicy : []
                }
                var addons = [];
                var gallery =[] ;
                if (room.available && req.query.start && req.query.end && req.query.numberOfPeople) {
                    room.booking = "?add-to-cart=1209&propertyId=" + response.body[k].rooms[i].propertyId +
                        "&roomId=" + response.body[k].rooms[i].id + "&product_id=1209" + "&startDate=" +
                            linkstartDate + "&endDate=" + linkendDate + "&numberOfPeople=" + req.query.numberOfPeople + "&roomname=" + response.body[k].name + "&hotelname=" + response.body[k].rooms[i].name
                        + "&quantity=1"
                }
                console.log(room.booking)
                if (response.body[k].rooms[i].images[0]) {
                    room.featureImage = response.body[k].rooms[i].images[0].filePath;
                }
                if (response.body[k].rooms[i].images.length > 0) {
                    for (let j = 0; j < response.body[k].rooms[i].images.length; j++) {
                     var   obj = response.body[k].rooms[i].images[j].filePath
                        room["gallery" + j]     = response.body[k].rooms[i].images[j].filePath
                        gallery.push(obj);
                    }
                }

                room.gallery = gallery.reverse();
                for (let j = 0; j < response.body[k].rooms[i].roomAddonCategories.length; j++) {
                    addons.push({
                        name: response.body[k].rooms[i].roomAddonCategories[j].name,
                        addonNames: response.body[k].rooms[i].roomAddonCategories[j].addonNames
                    });
                }
                room.addons = addons;
                var cancellationPolicy = getCancelCache(data.id);
                if(cancellationPolicy) {
                    for (var j = 0; j < cancellationPolicy.length; j++) {
                        console.log( cancellationPolicy[j])

                            for (var x = 0; x < cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules.length; x++) {
                            var date = new Date(req.query.start * 1000)
                            var cancel = {}
                            if(cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].rangeRoomsTo
                                > req.query.numberOfRooms > cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].rangeRoomsFrom) {

                                for (var y = 0; y < cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines.length; y++) {

                                    if (cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines[y].interval === "DAYS") {
                                        cancel = new Date(date.getDate() - ( cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines[y].toPeriod))
                                        room.cancellationPolicy.push("Hours " + data.checkInStartTime + " " + cancel.toISOString().substring(0, 10)
                                            + cancellationPolicy.cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines[y].percent)
                                    }
                                    if (cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].interval === "HOURS") {
                                        cancel = new Date(date.getHours() - ( cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines[y].toPeriod))
                                        room.cancellationPolicy.push("Hours " + data.checkInStartTime + " " + cancel.toISOString().substring(0, 10)
                                            +  cancellationPolicy[j].cancellationPolicy.cancellationPolicyRules[x].cancellationPolicyLines[y].percent)
                                    }
                                }                       }

                    }
                    }
                }
                data.rooms.push(room)
            }


            array.result.push(
                data
            );
        }
        if (req.query.city) {
            var s = req.query.city;
            var translate = {
                "á": "a", "ö": "o", "ú": "u",
                "Á": "A", "Ö": "O", "Ú": "U",
                "Ý": "Y", "í": "i", "Í": "I",
                "ý": "y", "ó": "o", "Ó": "O"   // probably more to come
            };
            var translate_re = /[áÁöÖúÚóÓýÝíÍ]/g;
            var str = (s.replace(translate_re, function (match) {
                return translate[match];
            }));
            array.result = array.result.filter(hotel => hotel.city.replace(translate_re, function (match) {
                return translate[match];
            }) === (req.query.city || str));
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
const {getHotelCache, getCancelCache} = require("./cache");

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
