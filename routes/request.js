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
            var db = new JSONdb('./cache.json')
            var cache = db.JSON()
            var request = require('request');
            var token = cache.token;
            var options = {
                'method': 'GET',
                'url': 'https://stage-api.travia.is/api/v1/travelAgents/cooperations/activeCooperatingPropertiesSelectList',
                'headers': {
                    'Authorization': 'Bearer ' + token.access_token
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error)
                response.body = JSON.parse(response.body)
                var request1 = require('request');

                var request2 = require('request');
                var request3 = require('request');
                for (var i = 0; i < response.body.length; i++) {
                    options.url = 'https://stage-api.travia.is/api/v1/properties/' + response.body[i].id + '/details/cooperating';
                    request1(options, function (error1, response1) {
                        if (error1) throw new Error(error1)
                        response1.body = JSON.parse(response1.body)
                        options.url = 'https://stage-api.travia.is/api/v1/properties/' + response1.body.id + '/rooms';
                        request2(options, function (error2, response2) {
                            if (error2) throw new Error(error2)

                            options.url = 'https://stage-api.travia.is/api/v1/properties/' + response1.body.id + '/files';

                            request3(options, function (error3,response3)  {
                                if (error3) throw new Error(error3)
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
                                    propertyAmenityNames: response1.body.propertyAmenityNames,
                                    rooms: [],
                                    featureImage: "",
                                    gallery:{} ,
                                    isEmpty:false
                                }
                                response3.body = JSON.parse(response3.body)
                                for (var k = 0; k < response3.body.length; k++) {
                                    hotelargs.gallery[k] =(response3.body[k].filePath);
                                    if(k === 0) {
                                        hotelargs.featureImage = response3.body[k].filePath
                                    }

                                }
                                response2.body = JSON.parse(response2.body)
                            for (var j = 0; j < response2.body.length; j++) {

                                var imgs = {};
                                for (var k = 0; k < response2.body[j].files.length; k++) {
                                    imgs[k] = (response2.body[j].files[k].filePath);
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
                                    featureimage: imgs[0],
                                    gallery: imgs,
                                    addons: addons,
                                    isEmpty: false


                                }

                                hotelargs.rooms.push(roomargs);
                            }
                            hotelargs.rooms = hotelargs.rooms.reverse()
                            var request4 = require('request');
                                options.url = "https://stage-api.travia.is//api/v1/travelAgents/577/property/"+response1.body.id + "/cooperations";
                                request4(options, function (error4,response4) {
                                      hotelargs.information = JSON.parse(response4.body);
                                });
                                    cache.data.push(hotelargs);
                            db.JSON(cache)
                            db.sync();
                        })
                        })  })
                }
            });
            db.set('cache', true)
            db.sync()

            return db.JSON().data;
        });


    },
    getImage : function() {
        var data = new JSONdb('./data.json')

        var upt = data.JSON();

        var date = new Date();
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }

        date.addDays(30);
        var secDate = new Date();
        secDate.addDays(31)
        for (var i = 0; i < upt.length; i++) {

            options.url = 'https://stage-api.travia.is/api/v1/travelAgents/577/search/availability'
            options.url = options.url + '?propertyId=' + upt[i].rooms[0].propertyId;
            options.url = options.url + '&numberOfExtraBeds='+ 1;
            options.url = options.url + '&numberOfRooms=' + 1;
            options.url = options.url + '&roomIds=' + upt[i].rooms[0].roomId;

            options.url = options.url + '&end=' + secDate.toISOString().split('T')[0]
            options.url = options.url + '&start=' + date.toISOString().split('T')[0]
            request(options, function (error, response) {
                if (error) throw new Error(error)
                console.log(response.body)
                response.body = JSON.parse(response.body)
                for (var j = 0; j < response.body.images.length; j++) {
                    if(response.body.images.length === (j+1)) {
                        upt[j].featuredImage = response.body.images[j].filePath
                    }
                }
                upt[j].gallery = response.images;
                data.JSON(upt);
            });
        }
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
