const JSONdb = require("simple-json-db");
const request = require("./request");
module.exports = {
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
}
