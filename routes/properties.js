var express = require('express');
var router = express.Router();
const JSONdb = require("simple-json-db");
const request = require("request");
/* GET users listing. */
router.get('/:id', function(req, res, next) {
    var db = new JSONdb('./db.json');
    var token = db.JSON();
    console.log(token)
    var options = {
        'method': 'GET',
        'url': 'https://stage-api.travia.is/api/v1/properties/'+req.params.id+'/details/cooperating',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
     request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
        res.send(response.body);
    });
});
router.get('/', function(req, res, next) {
        var db = new JSONdb('./db.json');
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
            console.log(response.body);
            res.send(response.body);
        });
});
module.exports = router;
