var request = require('request');
const JSONdb = require('simple-json-db');
const {getCancelCache} = require("./cache");



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
    saveToTable: async function () {
            await new Promise(r => {

            });

    },

    save: async function () {
        await new Promise(r => {
            var db = new JSONdb('./cache.json')
            var cache = db.JSON()
            cache.data = [];
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

                                }

                                response3.body = JSON.parse(response3.body)
                                var gallery = [];
                                if(response1.body.logo) {
                                    hotelargs['featureImage'] = response1.body.logo.filePath
                                }
                                if(response1.body.name) {
                                    hotelargs['name'] = response1.body.name
                                }
                                if(response1.body.description) {
                                    hotelargs['description'] = response1.body.description
                                }
                                if(response1.body.location.address) {
                                    hotelargs['address'] = response1.body.location.address
                                }
                                if(response1.body.location.postalCode) {
                                    hotelargs['postalCode'] = response1.body.location.postalCode
                                }
                                if(response1.body.location.latitude) {
                                    hotelargs['latitude'] = response1.body.location.latitude
                                }
                                if(response1.body.location.longitude) {
                                    hotelargs['longitude'] = response1.body.location.longitude
                                }
                                if(response1.body.contact.email) {
                                    hotelargs['email'] = response1.body.contact.email
                                }
                                if(response1.body.contact.phone) {
                                    hotelargs['phone'] = response1.body.contact.phone
                                }
                                if(response1.body.propertyTypeName) {
                                    hotelargs['propertyTypeName'] = response1.body.propertyTypeName
                                }
                                if(response1.body.propertyAmenityNames) {
                                    hotelargs['propertyAmenityNames'] = response1.body.propertyAmenityNames
                                }
                                if(response1.body.propertyAddonNames) {
                                    hotelargs['propertyAddonNames'] = response1.body.propertyAddonNames
                                }




                                for (var k = 0; k < response3.body.length; k++) {
                                    gallery.push(response3.body[k].filePath);


                                }
                                if(gallery.length > 0 ) {
                                    gallery = gallery.reverse();
                                    for (let j = 0; j < gallery.length; j++) {
                                        hotelargs['gallery' + j] = gallery[j]
                                    }

                                    hotelargs['gallery'] = gallery;
                                }

                                var rooms = [];

                                response2.body = JSON.parse(response2.body)
                            for (var j = 0; j < response2.body.length; j++) {

                                var roomargs = {
                                }
                                var imgs = [];
                                for (var k = 0; k < response2.body[j].files.length; k++) {
                                    imgs[k] = response2.body[j].files[k].filePath;
                                    roomargs['gallery' + k] = response2.body[j].files[k].filePath
                                }
                                var addons = []
                                for (var k = 0; k < response2.body[j].roomAddOns.length; k++) {
                                    addons.push(response2.body[j].roomAddOns[k].addOnName)
                                }




                                if (imgs.length > 0) {
                                    roomargs['featureImage'] = imgs[0];
                                    gallery['gallery'] = imgs
                                }
                                if(addons.length > 0) {
                                    roomargs['addons'] = addons
                                }
                                if(response2.body[j].id) {
                                    roomargs['roomId'] =  response2.body[j].id
                                }
                                if(response2.body[j].propertyId) {
                                    roomargs['propertyId'] =  response2.body[j].propertyId
                                }
                                if(response2.body[j].name) {
                                    roomargs['name'] =  response2.body[j].name
                                }
                                if(response2.body[j].minOccupancy) {
                                    roomargs['minOccupancy'] =  response2.body[j].minOccupancy
                                }
                                if(response2.body[j].maxOccupancy) {
                                    roomargs['maxOccupancy'] =  response2.body[j].maxOccupancy
                                }
                                if(response2.body[j].roomSize) {
                                    roomargs['roomSize'] =  response2.body[j].roomSize
                                }
                                if(response2.body[j].description) {
                                    roomargs['description'] =  response2.body[j].description
                                }
                                if(response2.body[j].roomAmenityNames) {
                                    roomargs['roomAmenityNames'] =  response2.body[j].roomAmenityNames
                                }
                                if(response2.body[j].wholeYearAvailability) {
                                    roomargs['wholeYearAvailability'] =  response2.body[j].wholeYearAvailability
                                }
                                if(response2.body[j].roomTypeName) {
                                    roomargs['roomTypeName'] =  response2.body[j].roomTypeName
                                }
                                if(response2.body[j].roomCategoryName) {
                                    roomargs['roomCategoryName'] =  response2.body[j].roomCategoryName
                                }


                                rooms.push(roomargs);
                            }
                            if (rooms.length > 0) {
                                hotelargs['rooms'] = rooms.reverse()
                            } var request4 = require('request');
                                options.url = "https://stage-api.travia.is//api/v1/travelAgents/577/property/"+response1.body.id + "/cooperations";
                                request4(options, function (error4,response4) {
                                      hotelargs['cancellationPolicy'] = JSON.parse(response4.body);

                                    cache.data.push(hotelargs);
                            db.JSON(cache)
                            db.sync();
                                });
                        })
                        })  })
                }
            });
            db.set('cache', true)
            db.sync()

            return db.JSON().data;
        });


    },
    generateCancellationPolicy: function (id, numberOfRooms, DateStart) {
        var cancellation = getCancelCache(id)
        var room = "";

        var data = {}
        try {
            cancellation = cancellation[0].cancellationPolicy
            if (DateStart) {
                data.start = new Date(DateStart * 1000)
            }


            for (var i = 0; i < cancellation.length; i++) {
                var dateFrom = cancellation[i].startDate;
                var dateTo = cancellation[i].endDate;
                var check = data.start;
                if (dateTo !== null) {
                    dateTo = new Date(dateTo);

                }
                var date = {}
                dateFrom = new Date(dateFrom);
                if ((check > dateFrom) && (check < dateTo || !dateTo)) {

                    var cancellationPolicy = cancellation[i].cancellationPolicy.cancellationPolicyRules
                    for (var j = 0; j < cancellationPolicy.length; j++) {

                        if (cancellationPolicy[j].rangeRoomsTo
                            >= numberOfRooms >= cancellationPolicy[j].rangeRoomsFrom) {

                            for (var y = 0; y < cancellationPolicy[j].cancellationPolicyLines.length; y++) {
                                var cancel = cancellationPolicy[j].cancellationPolicyLines[y];

                                if (cancel.interval === "MONTHS") {
                                    var dateOffset = ((24 * 60 * 60 * 30 * 1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                if (cancel.interval === "WEEKS") {
                                    var dateOffset = ((24 * 60 * 60 * 7 * 1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);
                                }
                                if (cancel.interval === "DAYS") {
                                    var dateOffset = ((24 * 60 * 60 * 1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                if (cancel.interval === "HOURS") {
                                    var dateOffset = ((60 * 60 * 1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                var options = { year: 'numeric', month: 'long', day: 'numeric' };

                                room = check.toLocaleDateString("en-US",options)
                            }
                        }
                    }
                }

            }
        }catch (e) {
            console.log(e)
        }
            return room;
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
