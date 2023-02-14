const express = require('express');
const {isEmpty, cancellationPolicy, generateCancellationPolicy} = require("../functions/functions");
const dayjs = require("dayjs");
const {getToken} = require("../auth/authorization");
const router = express.Router();
router.get('', function (req, res, next) {
    getToken().then(function (results) {
        if (results.hasOwnProperty('access_token')) {
            let token = results
            let startDate = dayjs().add(30, "day").format("YYYY-MM-DD");
            let endDate = dayjs().add(35, "day").format("YYYY-MM-DD");
            let body = {
                numberOfPeople: 1,
                numberOfRooms: 1,
                start: startDate,
                end: endDate,
                showPropertiesWithoutCooperation: false
            };

            if (!isEmpty(req.query)) {
                if (req.query.hasOwnProperty("numberOfPeople")) {
                    if (req.query.numberOfPeople) {
                        body["numberOfPeople"] = req.query.numberOfPeople;
                    }
                }
                if (req.query.hasOwnProperty("numberOfExtraBeds")) {
                    if (req.query.numberOfExtraBeds) {
                        body["numberOfExtraBeds"] = req.query.numberOfExtraBeds;
                    }
                }
                if (req.query.hasOwnProperty("numberOfRooms")) {
                    if (req.query.numberOfRooms) {
                        body["numberOfRooms"] = req.query.numberOfRooms;
                    }
                }

                if (req.query.hasOwnProperty("start")) {
                    if (req.query.start) {
                        if (dayjs(req.query.start, 'YYYY-MM-DD').isValid()) {
                            body.start = req.query.start
                        }
                        if (!req.query.hasOwnProperty("end")) {
                            let args = dayjs(body.start, 'YYYY-MM-DD')
                            body.end = args.add(5, "day").format("YYYY-MM-DD");
                        }
                    }
                }
                if (req.query.hasOwnProperty("end")) {
                    if (req.query.end) {
                        if (dayjs(req.query.end, 'YYYY-MM-DD').isValid()) {
                            body.end = req.query.end
                        }
                        if (dayjs(body.end, 'YYYY-MM-DD').isBefore(dayjs(body.start, 'YYYY-MM-DD'))) {
                            let args = dayjs(body.start, 'YYYY-MM-DD')
                            body.end = args.add(5, "day").format("YYYY-MM-DD");
                        }
                    }
                }
                if (req.query.hasOwnProperty("duration")) {
                    if (req.query.duration.length > 0) {
                        if (req.query.duration.length === 1) {

                            body.start = dayjs.unix(req.query.duration[0]).format("YYYY-MM-DD");
                        }
                        if (req.query.duration.length === 2) {
                            body.start = dayjs.unix(req.query.duration[0]).format("YYYY-MM-DD");
                            body.end = dayjs.unix(req.query.duration[1]).format("YYYY-MM-DD");
                        }
                        if (dayjs(body.end, 'YYYY-MM-DD').isBefore(dayjs(body.start, 'YYYY-MM-DD'))) {
                            let args = dayjs(body.start, 'YYYY-MM-DD')
                            body.end = args.add(5, "day").format("YYYY-MM-DD");
                        }
                    }
                }
                if (req.query.hasOwnProperty("latitude")) {
                    if (req.query.latitude) {
                        body["latitude"] = req.query.latitude;
                    }
                }

                if (req.query.hasOwnProperty("longitude")) {
                    if (req.query.longitude) {
                        body["longitude"] = req.query.longitude;
                    }
                }

                if (req.query.hasOwnProperty("propertyId")) {
                    if (req.query.propertyId) {
                        body['propertyIds'] = [req.query.propertyId]
                    }

                }

                if (req.query.hasOwnProperty("roomIds")) {
                    if (req.query.roomIds) {
                        body['roomIds'] = [req.query.roomIds]
                    }
                }
            }

            let axios = require('axios');
            let config = require('./config.json').search;
            config.headers.Authorization = "Bearer " + token.access_token;
            config.data = JSON.stringify(body);

                axios(config)
                    .then(function (response) {
                        let array = {
                            result: []
                        }
                        for (let k = 0; k < response.data.length; k++) {
                            let data = {};

                            if (response.data[k].startDate !== null) {
                                data['startDate'] = body.start
                            }
                            if (response.data[k].endDate !== null) {
                                data['endDate'] = body.end
                            }
                            if (response.data[k].id !== null) {
                                data['id'] = response.data[k].id
                            }
                            if (response.data[k].checkInStartTime !== null) {
                                data['checkInStartTime'] = response.data[k].checkInStartTime;
                            }
                            if (response.data[k].checkInEndTime !== null) {
                                data['checkInEndTime'] = response.data[k].checkInEndTime;
                            }
                            if (response.data[k].propertyAmenityNames !== null) {
                                data['propertyAmenityNames'] = response.data[k].propertyAmenityNames;
                            }
                            if (response.data[k].pricesFrom !== null) {
                                data['pricesFrom'] = response.data[k].pricesFrom;
                            }
                            if (response.data[k].pricesFromCurrencySymbol !== null) {
                                data['pricesFromCurrencySymbol'] = response.data[k].pricesFromCurrencySymbol;
                            }
                            if (response.data[k].location.geoPoint.lat !== null) {
                                data['latitude'] = response.data[k].location.geoPoint.lat;
                            }
                            if (response.data[k].location.geoPoint.lat !== null) {
                                data['longitude'] = response.data[k].location.geoPoint.lon;
                            }
                            if (response.data[k].name !== null) {
                                data['name'] = response.data[k].name;
                            }
                            if (response.data[k].propertyTypeName !== null) {
                                data['propertyTypeName'] = response.data[k].propertyTypeName;
                            }
                            if (response.data[k].contact.email !== null) {
                                data['email'] = response.data[k].contact.email;
                            }
                            if (response.data[k].contact.url !== null) {
                                data['url'] = response.data[k].contact.url;
                            }
                            if (response.data[k].contact.phone !== null) {
                                data['phone'] = response.data[k].contact.phone;
                            }
                            if (response.data[k].contact.email !== null) {
                                data['email'] = response.data[k].contact.email;
                            }
                            if (response.data[k].location.address !== null) {
                                data['address'] = response.data[k].location.address;
                            }
                            if (response.data[k].location.postalCode !== null) {
                                data['postalCode'] = response.data[k].location.postalCode
                            }
                            if (response.data[k].location.city !== null) {
                                data['city'] = response.data[k].location.city;
                            }
                            if (response.data[k].location.country !== null) {
                                data['country'] = response.data[k].location.country;
                            }
                            if (response.data[k].description !== null) {
                                data['description'] = response.data[k].description;
                            }
                            if (response.data[k].additionalDescription !== null) {
                                data['additionalDescription'] = response.data[k].additionalDescription;
                            }
                            if (response.data[k].pricesFrom !== null) {
                                data['link'] = "propertyId:" + response.data[k].id + ";"

                                data.link = data.link + "start:" + data.startDate + ";";
                                data.link = data.link + "end:" + data.endDate + ";";
                                data.link = data.link + "numberOfPeople:" + body.numberOfPeople + ";";
                                data.link = data.link + "numberOfRooms:1;";


                            }
                            if(response.data[k].logo !== null) {
                                data['featureImage'] = response.data[k].logo.filePath;
                            }
                            if (response.data[k].images.length > 0) {
                                let gallery = [];
                                for (let i = 0; i < response.data[k].images.length; i++) {
                                    data['gallery' + i] = response.data[k].images[i].filePath;
                                    gallery[i] = response.data[k].images[i].filePath
                                }
                                data['gallery'] = gallery;
                            }
                            if(body.hasOwnProperty('propertyIds')) {
                                data['rooms'] = []
                            }

                            for (var i = 0; i < response.data[k].rooms.length; i++) {
                                var room = {};
                                /* var room = {

                                     name: response.data[k].rooms[i].name,
                                     roomId: response.data[k].rooms[i].id,
                                     description: response.data[k].rooms[i].description,
                                     minOccupancy: response.data[k].rooms[i].minOccupancy,
                                     maxOccupancy: response.data[k].rooms[i].maxOccupancy,
                                     extraBed: response.data[k].rooms[i].extraBed,
                                     extraBedQuantity: response.data[k].rooms[i].extraBedQuantity,
                                     roomSize: response.data[k].rooms[i].roomSize,
                                     propertyId: response.data[k].rooms[i].propertyId,
                                     roomTypeName: response.data[k].rooms[i].roomTypeName,
                                     roomCategoryName: response.data[k].rooms[i].roomCategoryName,
                                     wholeYearAvailability: response.data[k].rooms[i].wholeYearAvailability,
                                     availabilityChecked: response.data[k].rooms[i].availabilityChecked,
                                     available: response.data[k].rooms[i].available,
                                     averageDailyPrice: parseInt(response.data[k].rooms[i].averageDailyPrice).toLocaleString('de-DE'),
                                     price: parseInt(response.data[k].rooms[i].price).toLocaleString('de-DE'),
                                     niceDollars: ((parseInt(response.data[k].rooms[i].price) * 0.1).toFixed(0)).toLocaleString('de-DE'),
                                     currencyCode: response.data[k].rooms[i].currencyCode,
                                     currencySymbol: response.data[k].rooms[i].currencySymbol,
                                     availableQuantity: response.data[k].rooms[i].availableQuantity,
                                     discount: response.data[k].rooms[i].discount,
                                     discountDescription: response.data[k].rooms[i].discountDescription,
                                     discountsUsed: response.data[k].rooms[i].discountsUsed,
                                     originalCurrencySymbol: response.data[k].rooms[i].originalCurrencySymbol,
                                     originalCurrencyCode: response.data[k].rooms[i].originalCurrencyCode,
                                     priceDescription: response.data[k].rooms[i].priceDescription,
                                     breakfastAvailable: response.data[k].rooms[i].breakfastAvailable,
                                     breakfastIncluded: response.data[k].rooms[i].breakfastIncluded,
                                     totalBreakfastPrice: parseInt(response.data[k].rooms[i].totalBreakfastPrice).toLocaleString('de-DE'),
                                     totalOriginalBreakfastPrice: parseInt(response.data[k].rooms[i].totalOriginalBreakfastPrice).toLocaleString('de-DE'),
                                     extraBedPrice: parseInt(response.data[k].rooms[i].extraBedPrice).toLocaleString('de-DE'),
                                     extraBedOriginalPrice: parseInt(response.data[k].rooms[i].extraBedOriginalPrice).toLocaleString('de-DE')
                                     ,
                                     featureImage: "",
                                     gallery: [],
                                     roomAddonCategories: [],
                                     booking: '',
                                     cancellationPolicy : []
                                 }*/
                                if (response.data[k].rooms[i].name !== null) {
                                    room["name"] = response.data[k].rooms[i].name;
                                }
                                if (response.data[k].rooms[i].id !== null) {
                                    room["roomId"] = response.data[k].rooms[i].id;
                                }
                                if (response.data[k].rooms[i].description !== null) {
                                    room["description"] = response.data[k].rooms[i].description;
                                }
                                if (response.data[k].rooms[i].minOccupancy !== null) {
                                    room["minOccupancy"] = response.data[k].rooms[i].minOccupancy;
                                }
                                if (response.data[k].rooms[i].maxOccupancy !== null) {
                                    room["maxOccupancy"] = response.data[k].rooms[i].maxOccupancy;
                                }
                                if (response.data[k].rooms[i].extraBed !== null) {
                                    room["extraBed"] = response.data[k].rooms[i].extraBed;
                                }
                                if (response.data[k].rooms[i].extraBedQuantity !== null) {
                                    room["extraBedQuantity"] = response.data[k].rooms[i].extraBedQuantity;
                                }
                                if (response.data[k].rooms[i].roomSize !== null) {
                                    room["roomSize"] = response.data[k].rooms[i].roomSize;
                                }
                                if (response.data[k].rooms[i].propertyId !== null) {
                                    room["propertyId"] = response.data[k].rooms[i].propertyId;
                                }
                                if (response.data[k].rooms[i].roomTypeName !== null) {
                                    room["roomTypeName"] = response.data[k].rooms[i].roomTypeName;
                                }
                                if (response.data[k].rooms[i].roomCategoryName !== null) {
                                    room["roomCategoryName"] = response.data[k].rooms[i].roomCategoryName;
                                }
                                if (response.data[k].rooms[i].wholeYearAvailability !== null) {
                                    room["wholeYearAvailability"] = response.data[k].rooms[i].wholeYearAvailability;
                                }
                                if (response.data[k].rooms[i].availabilityChecked !== null) {
                                    room["availabilityChecked"] = response.data[k].rooms[i].availabilityChecked;
                                }
                                if (response.data[k].rooms[i].available !== null) {
                                    room["available"] = response.data[k].rooms[i].available;
                                }
                                if (response.data[k].rooms[i].averageDailyPrice !== null) {
                                    room["averageDailyPrice"] = parseInt(response.data[k].rooms[i].averageDailyPrice).toLocaleString('de-DE');
                                }
                                if (response.data[k].rooms[i].price !== null) {
                                    room["price"] = parseInt(response.data[k].rooms[i].price).toLocaleString('de-DE');
                                }
                                if (response.data[k].rooms[i].niceDollars !== null) {
                                    room["niceDollars"] = (parseInt(response.data[k].rooms[i].price) * 0.1).toFixed(0).toLocaleString('de-DE')
                                }
                                if (response.data[k].rooms[i].currencyCode !== null) {
                                    room["currencyCode"] = response.data[k].rooms[i].currencyCode;
                                }
                                if (response.data[k].rooms[i].currencySymbol !== null) {
                                    room["currencySymbol"] = response.data[k].rooms[i].currencySymbol;
                                }
                                if (response.data[k].rooms[i].availableQuantity !== null) {
                                    room["availableQuantity"] = response.data[k].rooms[i].availableQuantity;
                                }
                                if (response.data[k].rooms[i].discount !== null) {
                                    room["discount"] = response.data[k].rooms[i].discount;
                                }
                                if (response.data[k].rooms[i].discountDescription !== null) {
                                    room["discountDescription"] = response.data[k].rooms[i].discountDescription;
                                }
                                if (response.data[k].rooms[i].discountsUsed !== null) {
                                    room["discountsUsed"] = response.data[k].rooms[i].discountsUsed;
                                }
                                if (response.data[k].rooms[i].breakfastAvailable !== null) {
                                    room["breakfastAvailable"] = response.data[k].rooms[i].breakfastAvailable;
                                }
                                if (response.data[k].rooms[i].breakfastIncluded !== null) {
                                    room["breakfastIncluded"] = response.data[k].rooms[i].breakfastIncluded;
                                }
                                if (response.data[k].rooms[i].totalBreakfastPrice !== null) {
                                    room["totalBreakfastPrice"] = parseInt(response.data[k].rooms[i].totalBreakfastPrice).toLocaleString('de-DE');
                                }
                                if (response.data[k].rooms[i].totalOriginalBreakfastPrice !== null) {
                                    room["totalOriginalBreakfastPrice"] = parseInt(response.data[k].rooms[i].totalOriginalBreakfastPrice).toLocaleString('de-DE')
                                }
                                if (response.data[k].rooms[i].extraBedPrice !== null) {
                                    room["extraBedPrice"] = parseInt(response.data[k].rooms[i].extraBedPrice).toLocaleString('de-DE')
                                }
                                if (response.data[k].rooms[i].extraBedOriginalPrice !== null) {
                                    room["extraBedOriginalPrice"] = parseInt(response.data[k].rooms[i].extraBedOriginalPrice).toLocaleString('de-DE')
                                }

                                var addons = [];
                                if (room.price !== null) {
                                    room['booking'] = "?add-to-cart=1209&propertyId=" + response.data[k].rooms[i].propertyId +
                                        "&roomId=" + response.data[k].rooms[i].id + "&product_id=1209" + "&startDate=" +
                                        data.startDate + "&endDate=" + data.endDate + "&numberOfPeople=" + req.query.numberOfPeople + "&hotelname=" + response.data[k].name + "&roomname=" + response.data[k].rooms[i].name
                                       + "&numberOfRooms=" + req.query.numberOfRooms 
                                        + "&quantity=1"
                                    if (room.breakfastIncluded === false && room.breakfastAvailable === true) {
                                        room['priceWithBreakfast'] = parseInt(response.data[k].rooms[i].price + response.data[k].rooms[i].totalBreakfastPrice).toLocaleString("de-DE");
                                        room['priceWithBreakfastNicedollars'] = parseInt((response.data[k].rooms[i].price + response.data[k].rooms[i].totalBreakfastPrice) * 0.1).toLocaleString("de-DE");
                                        room['bookingWithBreakfast'] = room.booking + "&breakfast=true"
                                        room.booking = room.booking + "&breakfast=false"
                                    } else {
                                        room.booking = room.booking + "&breakfast=true"
                                    }
                                }

                                if (response.data[k].rooms[i].images.length > 0) {
                                    let gallery = []
                                    room['featureImage'] = response.data[k].rooms[i].images[0].filePath;
                                    for (let j = 0; j < response.data[k].rooms[i].images.length; j++) {
                                        room["gallery" + j] = response.data[k].rooms[i].images[j].filePath
                                        gallery[j] = response.data[k].rooms[i].images[j].filePath
                                    }
                                    room["gallery"] = gallery;
                                }
                                if (response.data[k].rooms[i].roomAddonCategories.length > 0) {
                                    for (let j = 0; j < response.data[k].rooms[i].roomAddonCategories.length; j++) {
                                        addons.push({
                                            name: response.data[k].rooms[i].roomAddonCategories[j].name,
                                            addonNames: response.data[k].rooms[i].roomAddonCategories[j].addonNames
                                        });
                                    }
                                }

                                if (addons.length > 0) {
                                    room['addons'] = addons;
                                }
                                if(data.hasOwnProperty('rooms'))
                                {
                                    if (room.price >0) {

                                        data.rooms.push(room)
                                    }

                                }

                            }

                            if (data.pricesFrom !== null && data.pricesFrom > 0) {
                                array.result.push(
                                    data
                                );
                            }

                        }
                        if (array.result.length > 0) {
                            if (req.query.hasOwnProperty('city')) {
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
                            }
                            if (body.hasOwnProperty('propertyIds')) {
                                if (body.propertyIds) {
                                    cancellationPolicy(token, body.propertyIds[0]).then(function (result) {

                                        if (result === false) {
                                            res.send(array)
                                        } else {
                                            try {
                                                var c = generateCancellationPolicy(body.propertyIds[0], body.numberOfRooms, body.start, result);
                                                array.result[0]['cancellationPolicy'] = c;
                                                for (let i = 0; i < array.result[0].rooms.length; i++) {
                                                    array.result[0].rooms[i]['cancellationPolicy'] = c;
                                                }
                                                res.send(array)

                                            } catch (e) {
                                                console.log(e);
                                                res.send(array)

                                            }
                                        }
                                    })
                                } else {
                                    res.send(array)
                                }
                            } else {
                                res.send(array)
                            }
                        } else {
                            res.send()
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.sendStatus(503)
                    });

        }
    }).catch(function (e) {
        console.log(e)
    })
});

module.exports = router;
