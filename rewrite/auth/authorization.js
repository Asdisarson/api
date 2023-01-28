var axios = require('axios');
var qs = require('qs');
const auth = require("./auth.json");
const config = require("./config.json");
module.exports = {
    getToken: async function () {
        var auth = require("./auth.json")
        var data = qs.stringify(auth);
        var config = require("./config.json");

        config.data = data;
        return await axios(config)
            .then(function (response) {
                return response.data
            })
            .catch(function (error) {
                console.log(error);
                return false
            });
    }
}
