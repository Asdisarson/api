var express = require('express');
var router = express.Router();
var request = require('request');
const {cache} = require("./cache");
const {clearCache} = require("ejs");
const {save} = require("./request");

/* GET home page. */
router.get('/', function(req, res, next) {
 if(req.body) {
     console.log(req.body)
     res.send(cache());
     clearCache()
     save()
 }
});

module.exports = router;
