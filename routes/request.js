var request = require('request');
const JSONdb = require('simple-json-db');



module.exports = {
    property: function(id) {
        var db = new JSONdb('./db.json');
        var token = db.JSON();
        var options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/properties/'+id+'/details/cooperating',
            'headers': {
                'Authorization': 'Bearer ' + token.accessToken
            }
        };
        return request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            return response.body;
        });
    },
    travelAgentsCoopHotels: function() {
        var db = new JSONdb('./db.json');
        var token = db.JSON();
        var options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/cooperations/cooperatingPropertiesSelectList',
            'headers': {
                'Authorization': 'Bearer ' + token.accessToken
            }
        };
      return  request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
          return JSON.parse(response.body);
        });
    },
    search: function(params) {
       var db = new JSONdb('./db.json');
        var request = require('request');
        var token = db.JSON();
        var options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/577/search/availability',
            'headers': {
                'Authorization': 'Bearer ' + token.accessToken
            }
        };
        if (params.propertyId) {
            options.url = options.url + 'propertyId='+params.propertyId;
        }
        if (params.numberOfExtraBeds) {
            options.url = options.url + '&numberOfExtraBeds=' + params.numberOfExtraBeds;
        }
        if (params.numberOfRooms) {
            options.url = options.url + '&numberOfRooms='+params.numberOfRooms;
        }
        if (params.roomIds) {
            options.url = options.url + '&roomIds='+params.roomIds;
        }
        if (params.end) {
            options.url = options.url + '&end='+params.end;
        }
        if (params.start) {
            options.url = options.url + '&start='+params.start;
        }

        return request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
             return JSON.parse(response.body);
        });

    },
    getById: function (arr, value) {

        for (var i=0, iLen=arr.length; i<iLen; i++) {

            if (arr[i].id === value) return arr[i];
        }
    },  getRoomById: function (arr, value) {

        for (var i=0, iLen=arr.length; i<iLen; i++) {

            if (arr[i].id === value) return arr[i].rooms;
        }
    },
    save: async function () {
        await new Promise(r => {
            var db = new JSONdb('./db.json');
            var data = new JSONdb('./data.json')
            data.JSON({data: []})
            data.sync();
            var request = require('request');
            var token = db.JSON();
            var options = {
                'method': 'GET',
                'url': 'https://stage-api.travia.is/api/v1/travelAgents/cooperations/cooperatingPropertiesSelectList',
                'headers': {
                    'Authorization': 'Bearer ' + token.access_token
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error)
                console.log(JSON.parse(response.body))
                response.body = JSON.parse(response.body)
                var request1 = require('request');
                var request2 = require('request');
                for (var i = 0; i < response.body.length; i++) {
                    options.url = 'https://stage-api.travia.is/api/v1/properties/' + response.body[i].id + '/details/cooperating';
                    request1(options, function (error1, response1) {
                        if (error1) throw new Error(error1)
                        console.log(JSON.parse(response1.body))
                        response1.body = JSON.parse(response1.body)
                        options.url = 'https://stage-api.travia.is/api/v1/properties/' + response1.body.id + '/rooms';
                        request2(options, function (error2, response2) {
                            var storage = data.JSON();
                            if (error2) throw new Error(error2)
                            console.log(JSON.parse(response2.body))
                            var hotelargs = {
                                hotelId: response1.body.id,
                                name: response1.body.name,
                                description: response1.body.description,
                                address: response1.body.location.address,
                                city: response1.body.location.city,
                                country: response1.body.country,
                                postalCode: response1.body.location.postalCode,
                                latitude: response1.body.location.latitude,
                                longitude: response1.body.location.longitude,
                                email: response1.body.contact.email,
                                phone: response1.body.contact.phone,
                                propertyTypeName: response1.body.propertyTypeName,
                                amenity: response1.body.amenity,
                                rooms: [],
                                featuredImage : "",
                                images:[],

                            }
                            response2.body = JSON.parse(response2.body)
                            for (var j = 0; j < response2.body.length; j++) {
                                var imgs = [];
                                for (var k = 0; k < response2.body[j].files.length; k++) {
                                    imgs.push(response2.body[j].files[k].filePath);
                                }
                                var addons = []
                                for (var k = 0; k < response2.body[j].roomAddOns.length; k++) {
                                    addons.push(response2.body[j].roomAddOns[k].addOnName)
                                }

                                var roomargs = {
                                    roomId: response2.body[j].id,
                                    propertyId: response2.body[j].propertyId,
                                    name: response2.body[j].name,
                                    minOccupancy: response2.body[j].minOccupancy,
                                    maxOccupancy: response2.body[j].maxOccupancy,
                                    roomSize: response2.body[j].roomSize,
                                    description: response2.body[j].description,
                                    roomAmenityNames: response2.body[j].roomAmenityNames,
                                    wholeYearAvailability: response2.body[j].wholeYearAvailability,
                                    roomTypeName: response2.body[j].roomTypeName,
                                    roomCategoryName: response2.body[j].roomCategoryName,
                                    img: imgs[0],
                                    gallery: imgs,
                                    addons: addons,
                                    price:0,
                                    currency:"",
                                    currencySign:"",
                                    originalPrice:0,
                                    originalCurrency:"",
                                    originalSign:"",


                                }

                                hotelargs.rooms.push(roomargs);
                            }
                            storage.data.push(hotelargs);
                            data.JSON(storage);
                            data.sync();
                        })
                    })
                }
            });

            var updated = new JSONdb('./lastUpdate.json');
            updated.JSON({
                lastModified: Date().toString()
            })
            updated.sync()
            db.JSON({cache:true})
            db.sync()
            return true;
        });


    },
    getData: function(roomId, propertyId,i,y) {

        var date= new Date();
        var newDate = new Date(date.setMonth(date.getMonth()+i));
        var secDate = new Date(date.setMonth(date.getMonth()+y));

        var params = {
            roomIds: roomId,
            propertyId: propertyId,
            numberOfRooms:1,
            numberOfExtraBeds:1,
            end: secDate.toISOString(),
            start: newDate.toISOString()

        }
        var data = this.search(params)
        return data
    },
    rooms: function(room) {
        var db = new JSONdb('./db.json');
        var request = require('request');
        var token = db.JSON();
        var options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/properties/' + room + '/rooms',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token
            }
        };
        return request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body)
            {
                return JSON.parse(response.body);
            }
        })
    }
}


