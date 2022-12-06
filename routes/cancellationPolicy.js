
var express = require('express');
var router = express.Router();
const JSONdb = require("simple-json-db");
const {checkCache} = require("./checktime");
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
/* GET home page. */
router.get('', function(req, res, next) {
    if(req.query.propertyId && req.query.numberOfRooms && (req.query.duration||(req.query.start && req.query.end)) ) {
        var data = {
            end:'',
            start:'',
            static:''
        }
        if (req.query.duration) {
            req.query.start = req.query.duration[0]
            req.query.end = req.query.duration[1]
        }
        if (req.query.end) {
            data.end = new Date(   req.query.end * 1000)
            data.static = data.end
            data.end = data.end.toISOString().substring(0, 10)

        }

        if (req.query.start) {
            data.start = new Date(   req.query.start * 1000)
            data.start = data.start.toISOString().substring(0, 10)
        }
        var db = new JSONdb('./cache.json');
        var token = db.get('token');
        var options = {
            'method': 'get',
            'url': '',
            'headers': {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json',

            },
            'body': ''
        };
        var request = require('request');
        options.url = "https://stage-api.travia.is//api/v1/travelAgents/577/property/"+req.query.propertyId + "/cooperations";
        request(options, function (error4,response4) {
            var room = [];
            var cancellation = JSON.parse(response4.body);


            for (var i = 0; i < cancellation.length; i++) {
                var dateFrom = cancellation[i].startDate;
                var dateTo = cancellation[i].endDate;
                var dateCheck =data.start;
               var check = new Date(dateCheck);
                if(dateTo) {
                    dateTo   = new Date(dateTo);

                  }
                var date = {}
                dateFrom= new Date(dateFrom);
                console.log(dateFrom)
                console.log(check)// -1 because months are from 0 to 11// -1 because months are from 0 to 11
                console.log(check > dateFrom )
                if((check > dateFrom) && (check < dateTo || !dateTo)) {

                    var cancellationPolicy = cancellation[i].cancellationPolicy.cancellationPolicyRules
                    for (var j = 0; j < cancellationPolicy.length; j++) {

                        if (cancellationPolicy[j].rangeRoomsTo
                            >= req.query.numberOfRooms >= cancellationPolicy[j].rangeRoomsFrom) {

                            for (var y = 0; y < cancellationPolicy[j].cancellationPolicyLines.length; y++) {
                                var cancel = cancellationPolicy[j].cancellationPolicyLines[y];

                                if(cancel.interval === "MONTHS")
                                {
                                    var dateOffset = ((24*60*60*30*1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                if(cancel.interval === "WEEKS")
                                {
                                    var dateOffset = ((24*60*60*7*1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);
                                }
                                if(cancel.interval === "DAYS")
                                {
                                    var dateOffset = ((24*60*60*1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                if(cancel.interval === "HOURS")
                                {
                                    var dateOffset = ((60*60*1000) * cancel.toPeriod); //5 days
                                    check.setTime(check.getTime() - dateOffset);

                                }
                                    room.push("Cancel Before: " + check.toISOString().substring(0, 10) + " For Full Refund")
                            }
                        }
                    }
                }

            }
            res.send(room[0])
        });

    }
    else {
        res.send()
    }
});

module.exports = router;
