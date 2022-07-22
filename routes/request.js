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
            return response.body;
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

         request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            res.send(response.body);
        });

    },
    rooms: function(room){


},
    getAuthToken:  function() {



    }
}
