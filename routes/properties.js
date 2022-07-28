var express = require('express');
var router = express.Router();
const JSONdb = require("simple-json-db");
const request = require("request");
/* GET users listing. */
router.get('', function(req, res, next) {
        var db = new JSONdb('./db.json');
        var token = db.JSON();
        var options = {}
    if(req.query.id) {
         options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/properties/'+req.query.id+'/details/cooperating',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token
            }
        };
    }
    else if(req.query.room){
        options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/properties/' + req.query.room + '/rooms',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token
            }
        }
    }
    else{
        options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/cooperations/cooperatingPropertiesSelectList',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token
            }
        }   }
        ;
          request(options, function (error, response) {
            if (error) throw new Error(error)

            console.log(response.body);
            res.send(response.body);
        });
});
module.exports = router;
