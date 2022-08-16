var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
 if(req.body) {
     console.log(req.body)
     res.send();
 }
});

module.exports = router;
