var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log(req.headers);
    console.log(req.body)
    if(req.header('api-key-nicebooking') === "nicedollars") {
        var points = 0;
        var url = "https://nifty-cannon.134-209-30-23.plesk.page/wp-json/woorewards/v1/points/"
        if(req.body.amount) {
            points = (parseInt(req.body.amount)*0.1).toFixed(0);
        }
        var user_email = ""
        if(req.body.email) {
            user_email = req.body.email;
        }

            console.log(points)
           var options = {
                'method': 'PUT',
                'url': url + user_email + '/nicebooking/-'+ points +'/' + req.body.notes,
                'headers': {
                    'Authorization': 'Basic cmVzdDptcUdDIElvUXYgUFFlSiBkcHBoIGlXRGMgYUFDbQ==',
                    'Content-Type': 'application/json'
                },
                body: ''


            };
        var  options1 = {
            'method': 'PUT',
            'url': url + 'hallo@pineapple.is/nicebooking/-' + points + '/' + req.body.notes,
            'headers': {
                'Authorization': 'Basic cmVzdDptcUdDIElvUXYgUFFlSiBkcHBoIGlXRGMgYUFDbQ==',
                'Content-Type': 'application/json'
            },
            body: ''
        }
        request(options, function (error, response) {
            if (error) throw new Error(error);
            if(response.statusCode >= 400) {
                res.sendStatus(503)
                return false;
            }
            var request1 = require('request');

            return request1(options1, function (error, response) {
                if (error) throw new Error(error);
                if(response.statusCode >= 400) {
                    res.sendStatus(503)
                    return false;
                }else {
                    res.sendStatus(200)
                }
            })
        })
1

    }  else {
        res.sendStatus(401)
    }
});

module.exports = router;
