var express = require('express');
var router = express.Router();
const request = require("request");
const request1 = require("request");
const request2 = require("request");

/* GET users listing. */
router.get('', function(req, res, next) {
    var JSONdb = require("simple-json-db");

    var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'GET',
        'url': '',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
    if (req.query.id) {
        options.url = 'https://stage-api.travia.is/api/v1/properties/' + req.query.id + '/details/cooperating'
    request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
        var array = {
            result: []
        }
        if (req.query.id) {
            array.result.push(
                JSON.parse(response.body))
        } else {
            array.result =
                JSON.parse(response.body)

        }


        res.send(array);
    });
    }
    else if(req.query.room){
        options.url =  'https://stage-api.travia.is/api/v1/properties/' + req.query.room + '/rooms'

        request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            var array = {
                result : []}
            if(req.query.id){
                array.result.push(
                    JSON.parse(response.body))
            }
            else {
                array.result =
                    JSON.parse(response.body)

            }


            res.send(array);
        });
        return
    }
    else{
        options = {
            'method': 'GET',
            'url': 'https://stage-api.travia.is/api/v1/travelAgents/cooperations/cooperatingPropertiesSelectList',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token
            }
        }
        request(options, function (error, response) {
            if (error) throw new Error(error)
            console.log(response.body);
            var array = {
                result : []}

                array.result =
                    JSON.parse(response.body)

            var options1 = {
                'method': 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + token.access_token
                },
                'url':  ''
            }
            var options2 = {
                'method': 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + token.access_token
                },
                'url':  ''
            }
            var array1 = {
                result : []}
            var json = new JSONdb('./json.json');
            json.JSON(array1);
            json.sync();
            for (let i = 0; i < array.result.length; i++) {

                    console.log(array.result[i].id)
                    options1.url ='https://stage-api.travia.is/api/v1/properties/'+array.result[i].id+'/details/cooperating'
                    request1(options1, function (error1, response1) {
                        if (error) throw new Error(error)

                        options2.url =  'https://stage-api.travia.is/api/v1/properties/' + array.result[i].id + '/rooms'
                        request2(options2, function (error2, response2) {
                            if (error2) throw new Error(error2)
                            var item2 =json.JSON();
                            console.log(item2)
                            item2.result.push({
                                hotel:    JSON.parse(response1.body),
                                rooms:JSON.parse(response2.body)}
                            )
                            json.JSON(item2)
                            json.sync();
                        });
                    });

            }
            res.send(json.JSON());
        });
    }
        ;

});
router.get('/getall', function(req, res, next) {
    var JSONdb = require("simple-json-db");

    var db = new JSONdb('./json.json');
    db.sync();
 res.send(db.JSON())

});
module.exports = router;
