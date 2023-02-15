const axios = require("axios");
const {getCancelCache} = require("../../routes/cache");
module.exports = {
    isEmpty:  function (obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    },
     config: function() {
        return {
            method: '',
            url: '',
            headers: {
                'Authorization': '',
                'Content-Type': ''
            },
            data : {}
        }
     },
    removeFromCart:async function(token, id) {
        let axios = require('axios');
        let config = require('./config.json').RemoveBookingCart;
        config.url = "https://-api.travia.is/api/v1/travelAgents/577/bookingCarts/" + id.toString()
        config.headers.Authorization = "Bearer " + token.access_token;
        return await axios(config)
            .then(function (response) {
                return response.data
            }).catch(function (error) {
                console.log(error)
                return false
            })
    },
     cancellationPolicy: async function(token,id) {
         let axios = require('axios');
         let config = require('./config.json').cancellationPolicy;
         config.url = "https://-api.travia.is//api/v1/travelAgents/577/property/"+ id + "/cooperations"
         config.headers.Authorization = "Bearer " + token.access_token;
         return await axios(config)
             .then(function (response) {
                 return response.data
             }).catch(function (error) {
                 console.log(error)
                 return false
         })


     },
    generateCancellationPolicy: function (id, numberOfRooms, DateStart, cancellation) {
        var room = "";

        var data = {}
        try {
            if (DateStart) {
                data.start = new Date(DateStart)
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
    }
 }