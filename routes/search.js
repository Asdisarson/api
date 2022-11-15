const express = require('express');
const router = express.Router();
const axios = require('axios')
const qs = require('qs')
const JSONdb = require("simple-json-db");
const {getHotelCache} = require("../routes/cache");
function SortQuery(query) {

    let data ={
        start: '',
        end: ''
    };
    if (query.duration) {
        data.start = query.duration[0]
        data.end= query.duration[1]



            data.end = new Date(data.end * 1000)
            data.end = data.end.toISOString().substring(0, 10)

            data.start = new Date(data.start * 1000)
            data.start = data.start.toISOString().substring(0, 10)

    }
    else {
        data.start = addDays(Date.now(), 21 ).toISOString().substring(0, 10)
        data.end = addDays(Date.now(), 28).toISOString().substring(0, 10)
    }
    if (query.numberOfPeople) {
        data["numberOfPeople"] = query.numberOfPeople;
    }
    if (query.numberOfExtraBeds) {
        data["numberOfExtraBeds"] = query.numberOfExtraBeds;
    }
    if (query.numberOfRooms) {
        data["numberOfRooms"] = query.numberOfRooms;
    }

    if (query.latitude) {
        data["latitude"] = query.latitude;
    }

    if (query.longitude) {
        data["longitude"] = query.longitude;
    }

    if (query.propertyId) {
        data['propertyIds'] = [query.propertyId]
    }

    if (query.roomIds) {
        data['roomIds'] = [query.roomIds]
    }
    return data;
}
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
router.get('', function (req, res, next) {
    if(req.query.propertyId) {
        next()
    }
    else {
        let qs = require('qs');
        let data = qs.stringify({
            'grant_type': 'password',
            'username': 'larus@islandsvefir.is',
            'password': 'TAbekind4441!'
        });
        let config = {
            method: 'post',
            url: 'https://stage-api.travia.is/oauth/token',
            headers: {
                'Authorization': 'Basic Z29kby1pczpnb2RvQXBwbGljYXRpb24=',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'AWSELB=3BCBF9F2BE75549B8FDB3EC05D3BED0030384CCF0D223363CE261B86C6CE176CDE78271B6C7465CAFBEA6A66BA517AE784043E1D5405AB0B22D5E8FB35AEA06E2E0E5F6E; AWSELBCORS=3BCBF9F2BE75549B8FDB3EC05D3BED0030384CCF0D223363CE261B86C6CE176CDE78271B6C7465CAFBEA6A66BA517AE784043E1D5405AB0B22D5E8FB35AEA06E2E0E5F6E'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                data =SortQuery(req.query);
                return axios({
                    method: 'post',
                    url: 'https://stage-api.travia.is/api/v1/travelAgents/577/search/',
                    headers:{
                        'Authorization': 'Bearer ' + response.data.access_token,
                        'Content-Type':'application/json'
                    },
                    data: data
                })
            }).then(response => {
            let hotels = [];
            response = response.data
            for (let k = 0; k < response.length; k++) {
                data = {
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
                    cancellationPolicy: ''
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
                if (response[k].id) {
                    data.id = response[k].id
                }
                if (response[k].checkInStartTime) {
                    data.checkInStartTime = response[k].checkInStartTime;
                }
                if (response[k].checkInEndTime) {
                    data.checkInEndTime = response[k].checkInEndTime;
                }
                if (response[k].propertyAmenityNames) {
                    data.propertyAmenityNames = response[k].propertyAmenityNames;
                }
                if (response[k].pricesFrom) {
                    data.pricesFrom = response[k].pricesFrom;
                }
                if (response[k].pricesFromCurrencySymbol) {
                    data.pricesFromCurrencySymbol = response[k].pricesFromCurrencySymbol;
                }
                if (response[k].location.geoPoint.lat) {
                    data.latitude = response[k].location.geoPoint.lat;
                }
                if (response[k].location.geoPoint.lat) {
                    data.longitude = response[k].location.geoPoint.lon;
                }
                if (response[k].name) {
                    data.name = response[k].name;
                }
                if (response[k].propertyTypeName) {
                    data.propertyTypeName = response[k].propertyTypeName;
                }
                if (response[k].contact.email) {
                    data.email = response[k].contact.email;
                }
                if (response[k].contact.url) {
                    data.url = response[k].contact.url;
                }
                if (response[k].contact.phone) {
                    data.phone = response[k].contact.phone;
                }
                if (response[k].contact.email) {
                    data.email = response[k].contact.email;
                }
                if (response[k].location.address) {
                    data.address = response[k].location.address;
                }
                if (response[k].location.postalCode) {
                    data.postalCode = response[k].location.postalCode
                }
                if (response[k].location.city) {
                    data.city = response[k].location.city;
                }
                if (response[k].location.country) {
                    data.country = response[k].location.country;
                }
                if (response[k].description) {
                    data.description = response[k].description;
                }
                if (response[k].additionalDescription) {
                    data.additionalDescription = response[k].additionalDescription;
                }
                if (req.query.start && req.query.end && req.query.numberOfPeople &&req.query.numberOfRooms) {
                    data.link = "propertyId:" + response[k].id + ";"
                    data.link = data.link + "start:" + req.query.start + ";";
                    data.link = data.link + "end:" + req.query.end + ";";
                    data.link = data.link + "numberOfPeople:" + req.query.numberOfPeople + ";";
                    data.link = data.link + "numberOfRooms:1;";
                }
                for (let i = 0; i < response[k].images.length; i++) {
                    if (i === 0) {
                        data.featureImage = response[k].images[i].filePath

                    }
                    let temp = response[k].images[i].filePath;
                    data["gallery" + i] = response[k].images[i].filePath;

                    data.gallery[i]=temp
                }

                hotels.push(data);
            }
            let array = {
                data: hotels
            }

            if (req.query.city) {
                let s = req.query.city;
                let translate = {
                    "á": "a", "ö": "o", "ú": "u",
                    "Á": "A", "Ö": "O", "Ú": "U",
                    "Ý": "Y", "í": "i", "Í": "I",
                    "ý": "y", "ó": "o", "Ó": "O"   // probably more to come
                };
                let translate_re = /[áÁöÖúÚóÓýÝíÍ]/g;
                let str = (s.replace(translate_re, function (match) {
                    return translate[match];
                }));
                array.result = array.result.filter(hotel => hotel.city.replace(translate_re, function (match) {
                    return translate[match];
                }) === (req.query.city || str));
            }
            res.send(array);



        })
            .catch(function (error) {
                console.log(error);
            });
    }

});
router.get('', function (req, res, next) {
    if(req.query.propertyId) {
        let qs = require('qs');
        let data = qs.stringify({
            'grant_type': 'password',
            'username': 'larus@islandsvefir.is',
            'password': 'TAbekind4441!'
        });
        let config = {
            method: 'post',
            url: 'https://stage-api.travia.is/oauth/token',
            headers: {
                'Authorization': 'Basic Z29kby1pczpnb2RvQXBwbGljYXRpb24=',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'AWSELB=3BCBF9F2BE75549B8FDB3EC05D3BED0030384CCF0D223363CE261B86C6CE176CDE78271B6C7465CAFBEA6A66BA517AE784043E1D5405AB0B22D5E8FB35AEA06E2E0E5F6E; AWSELBCORS=3BCBF9F2BE75549B8FDB3EC05D3BED0030384CCF0D223363CE261B86C6CE176CDE78271B6C7465CAFBEA6A66BA517AE784043E1D5405AB0B22D5E8FB35AEA06E2E0E5F6E'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                data = SortQuery(req.query);
                return axios({
                    method: 'post',
                    url: 'https://stage-api.travia.is/api/v1/travelAgents/577/search/',
                    headers: {
                        'Authorization': 'Bearer ' + response.data.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: data
                })
            }).then(response => {
            let hotels = [];
            response = response.data
            for (let k = 0; k < response.length; k++) {
                data = {
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
                if (response[k].id) {
                    data.id = response[k].id
                }
                if (response[k].checkInStartTime) {
                    data.checkInStartTime = response[k].checkInStartTime;
                }
                if (response[k].checkInEndTime) {
                    data.checkInEndTime = response[k].checkInEndTime;
                }
                if (response[k].propertyAmenityNames) {
                    data.propertyAmenityNames = response[k].propertyAmenityNames;
                }
                if (response[k].pricesFrom) {
                    data.pricesFrom = response[k].pricesFrom;
                }
                if (response[k].pricesFromCurrencySymbol) {
                    data.pricesFromCurrencySymbol = response[k].pricesFromCurrencySymbol;
                }
                if (response[k].location.geoPoint.lat) {
                    data.latitude = response[k].location.geoPoint.lat;
                }
                if (response[k].location.geoPoint.lat) {
                    data.longitude = response[k].location.geoPoint.lon;
                }
                if (response[k].name) {
                    data.name = response[k].name;
                }
                if (response[k].propertyTypeName) {
                    data.propertyTypeName = response[k].propertyTypeName;
                }
                if (response[k].contact.email) {
                    data.email = response[k].contact.email;
                }
                if (response[k].contact.url) {
                    data.url = response[k].contact.url;
                }
                if (response[k].contact.phone) {
                    data.phone = response[k].contact.phone;
                }
                if (response[k].contact.email) {
                    data.email = response[k].contact.email;
                }
                if (response[k].location.address) {
                    data.address = response[k].location.address;
                }
                if (response[k].location.postalCode) {
                    data.postalCode = response[k].location.postalCode
                }
                if (response[k].location.city) {
                    data.city = response[k].location.city;
                }
                if (response[k].location.country) {
                    data.country = response[k].location.country;
                }
                if (response[k].description) {
                    data.description = response[k].description;
                }
                if (response[k].additionalDescription) {
                    data.additionalDescription = response[k].additionalDescription;
                }

                for (let i = 0; i < response[k].images.length; i++) {
                    if (i === 0) {
                        data.featureImage = response[k].images[i].filePath

                    }
                    let temp = response[k].images[i].filePath;
                    data["gallery" + i] = response[k].images[i].filePath;

                    data.gallery[i] = temp
                }

                let cancellation = getHotelCache(data.id).cancellationPolicy

                for (let i = 0; i < cancellation.length; i++) {
                    let dateFrom = cancellation[i].startDate;
                    let dateTo = cancellation[i].endDate;
                    let dateCheck = data.startDate;
                    let check = new Date(dateCheck);
                    if (dateTo) {
                        dateTo = new Date(dateTo);

                    }
                    let date = {}
                    dateFrom = new Date(dateFrom);


                    if (((check > dateFrom) && (check < dateTo))||(!dateTo)) {

                        let cancellationPolicy = cancellation[i].cancellationPolicy.cancellationPolicyRules
                        for (let j = 0; j < cancellationPolicy.length; j++) {

                            if (cancellationPolicy[j].rangeRoomsTo
                                >= req.query.numberOfRooms >= cancellationPolicy[j].rangeRoomsFrom) {

                                for (let y = 0; y < cancellationPolicy[j].cancellationPolicyLines.length; y++) {
                                    let cancel = cancellationPolicy[j].cancellationPolicyLines[y];

                                    if (cancel.interval === "MONTHS") {
                                        let dateOffset = ((24 * 60 * 60 * 30 * 1000) * cancel.toPeriod); //5 days
                                        check.setTime(check.getTime() - dateOffset);

                                    }
                                    if (cancel.interval === "WEEKS") {
                                        let dateOffset = ((24 * 60 * 60 * 7 * 1000) * cancel.toPeriod); //5 days
                                        check.setTime(check.getTime() - dateOffset);
                                    }
                                    if (cancel.interval === "DAYS") {
                                        let dateOffset = ((24 * 60 * 60 * 1000) * cancel.toPeriod); //5 days
                                        check.setTime(check.getTime() - dateOffset);

                                    }
                                    if (cancel.interval === "HOURS") {
                                        let dateOffset = ((60 * 60 * 1000) * cancel.toPeriod); //5 days
                                        check.setTime(check.getTime() - dateOffset);

                                    }
                                    if(check.toString() !== "Invalid Date"){
                                        data.cancellationPolicy.push("Cancel Before: " + check.toISOString().substring(0, 10) + " For Full Refund")
                                    }
                                }
                            }
                        }
                    }
                }
                for (let i = 0; i < response[k].rooms.length; i++) {
                    var room = {

                        name: response[k].rooms[i].name,
                        roomId: response[k].rooms[i].id,
                        description: response[k].rooms[i].description,
                        minOccupancy: response[k].rooms[i].minOccupancy,
                        maxOccupancy: response[k].rooms[i].maxOccupancy,
                        extraBed: response[k].rooms[i].extraBed,
                        extraBedQuantity: response[k].rooms[i].extraBedQuantity,
                        roomSize: response[k].rooms[i].roomSize,
                        propertyId: response[k].rooms[i].propertyId,
                        roomTypeName: response[k].rooms[i].roomTypeName,
                        roomCategoryName: response[k].rooms[i].roomCategoryName,
                        wholeYearAvailability: response[k].rooms[i].wholeYearAvailability,
                        availabilityChecked: response[k].rooms[i].availabilityChecked,
                        available: response[k].rooms[i].available,
                        averageDailyPrice: parseInt(response[k].rooms[i].averageDailyPrice).toLocaleString('de-DE'),
                        price: parseInt(response[k].rooms[i].price).toLocaleString('de-DE'),
                        niceDollars: ((parseInt(response[k].rooms[i].price) * 0.1).toFixed(0)).toLocaleString('de-DE'),
                        currencyCode: response[k].rooms[i].currencyCode,
                        currencySymbol: response[k].rooms[i].currencySymbol,
                        availableQuantity: response[k].rooms[i].availableQuantity,
                        discount: response[k].rooms[i].discount,
                        discountDescription: response[k].rooms[i].discountDescription,
                        discountsUsed: response[k].rooms[i].discountsUsed,
                        originalCurrencySymbol: response[k].rooms[i].originalCurrencySymbol,
                        originalCurrencyCode: response[k].rooms[i].originalCurrencyCode,
                        priceDescription: response[k].rooms[i].priceDescription,
                        breakfastAvailable: response[k].rooms[i].breakfastAvailable,
                        breakfastIncluded: response[k].rooms[i].breakfastIncluded,
                        totalBreakfastPrice: parseInt(response[k].rooms[i].totalBreakfastPrice).toLocaleString('de-DE'),
                        totalOriginalBreakfastPrice: parseInt(response[k].rooms[i].totalOriginalBreakfastPrice).toLocaleString('de-DE'),
                        extraBedPrice: parseInt(response[k].rooms[i].extraBedPrice).toLocaleString('de-DE'),
                        extraBedOriginalPrice: parseInt(response[k].rooms[i].extraBedOriginalPrice).toLocaleString('de-DE')
                        ,
                        featureImage: "",
                        gallery: [],
                        roomAddonCategories: [],
                        booking: '',
                        cancellationPolicy: []
                    }
                    let addons = [];
                    let gallery = [];
                    let links = SortQuery(req.query);

                    if (room.availableQuantity > 0) {
                        room.booking = "?add-to-cart=1209&propertyId=" + response[k].rooms[i].propertyId +
                            "&roomId=" + response[k].rooms[i].id + "&product_id=1209" + "&startDate=" +
                            links.start + "&endDate=" + links.end + "&numberOfPeople=" + req.query.numberOfPeople + "&hotelname=" + response[k].name + "&roomname=" + response[k].rooms[i].name
                            + "&quantity=1"
                    }
                    if (response[k].rooms[i].images[0]) {
                        room.featureImage = response[k].rooms[i].images[0].filePath;
                    }
                    if (response[k].rooms[i].images.length > 0) {
                        for (let j = 0; j < response[k].rooms[i].images.length; j++) {
                            let obj = response[k].rooms[i].images[j].filePath
                            room["gallery" + j] = response[k].rooms[i].images[j].filePath
                            gallery[j] = obj;
                        }
                    }

                    room.gallery = gallery
                    for (let j = 0; j < response[k].rooms[i].roomAddonCategories.length; j++) {
                        addons[j] = {
                            name: response[k].rooms[i].roomAddonCategories[j].name,
                            addonNames: response[k].rooms[i].roomAddonCategories[j].addonNames
                        };
                    }
                    if (data.cancellationPolicy) {
                        room.cancellationPolicy = data.cancellationPolicy;
                    }

                    room.addons = addons;
                    data.rooms.push(room);

                }
                hotels=data

            }
            let array = {
                data: hotels
            }

            res.send(array);


        })
            .catch(function (error) {
                console.log(error);
            });
    }})
module.exports = router;
