const PORT = process.env.PORT || 3000
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require("express");
var app = express()
var winston = require('winston'),
    expressWinston = require('express-winston');

const {getToken} = require("./auth/authorization");
const indexRouter = require("./routes/search-route");
const cartRouter = require("./routes/cart-route");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    statusLevels: false,
    level: function (req, res) {
        var level = "";
        if (res.statusCode >= 100) { level = "info"; }
        if (res.statusCode >= 400) { level = "warn"; }
        if (res.statusCode >= 500) { level = "error"; }
        // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
        if (res.statusCode === 401 || res.statusCode === 403) { level = "critical"; }
        // No one should be using the old path, so always warn for those
        if (req.path === "/v1" && level === "info") { level = "warn"; }
        return level;
    },
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
}));


app.use((req, res, next) => {
    next()
})
app.use('/search', indexRouter);
//app.use('/cart', cartRouter);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
