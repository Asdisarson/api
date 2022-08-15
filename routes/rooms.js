var express = require('express');
const JSONdb = require("simple-json-db");
const request = require("request");
const {save} = require("./request");
const {getHotelCache, getRoomCache} = require("./cache");
var router = express.Router();

router.get('', function (req, res, next){
    if(req.query.hotelId||req.query.propertyId) {
        if(req.query.propertyId)  {
            req.query.hotelId = req.query.propertyId
        }

        res.send({
            data:getRoomCache(req.query.hotelId)
        });}

    else{
        res.send ({
            roomId: '',
            propertyId: '',
            name: '',
            minOccupancy: '',
            maxOccupancy: '',
            roomSize: '',
            description: '',
            roomAmenityNames: '',
            wholeYearAvailability: '',
            roomTypeName: '',
            roomCategoryName: '',
            img: '',
            gallery: [],
            addons: [],
            isEmpty: false
        })
    }
})


/* GET users listing.
router.get('/:id', function(req, res, next) {
  /*  var db = new JSONdb('./db.json');
    var token = db.JSON();
    var options = {
        'method': 'GET',
        'url': 'https://stage-api.travia.is/api/v1/properties/'+ req.params.id + '/rooms',
        'headers': {
            'Authorization': 'Bearer ' + token.access_token
        }
    };
     request(options, function (error, response) {
        if (error) throw new Error(error)
        console.log(response.body);
         console.log(response.body);
         var array = {
             result : []}
         array.result.push(
             JSON.parse(response.body)
         );

         res.send(array);    });


         });*/
module.exports = router;
