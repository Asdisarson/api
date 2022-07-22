var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'GET',
        'url': 'https://stage-api.travia.is/api/v1/properties/'+ req.params.room + '/rooms',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
     request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
        res.send(response.body);
    });});

module.exports = router;
