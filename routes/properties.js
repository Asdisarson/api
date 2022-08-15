var express = require('express');
var router = express.Router();
const JSONdb = require("simple-json-db");
const {save} = require("./request");
const {getHotelCache} = require("./cache");

/* GET users listing. */

router.get('', function (req, res, next){
    if(req.query.hotelId) {

        res.send({
            data:getHotelCache(req.query.hotelId)
        });}

   else{
       next();
   }
})
router.get('', function (req, res, next){
    var data = new JSONdb('./cache.json');
    var output = data.get('data');
    console.log(output)
    if(output.length > 0){
        res.send({data:output});
    }
    else {
        save()
        res.send({data:[{
            hotelId: '',
            name: '',
            description: '',
            address: '',
            city: '',
            country: '',
            postalCode: '',
            latitude: '',
            longitude: '',
            email: '',
            phone: '',
            propertyTypeName: '',
            amenity: [],
            rooms: [],
            featuredImage: "",
            images: [],
            isEmpty:true
        }]})
    }
})


module.exports = router;
