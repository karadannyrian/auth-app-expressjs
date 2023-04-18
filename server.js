'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,


    User = require('./api/models/userModel'),
    bodyParser = require('body-parser'),
    jsonwebtoken = require("jsonwebtoken");


require("dotenv").config();
const mongoose = require('mongoose');
const option = {
    dbName: 'framework_v_1',
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, option).then(function () {
    console.log("connected successfully")
}, function (err) {
    console.log("connection failed", err)
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY, function (err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});
var routes = require('./api/routes/userRoutes');
routes(app);

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);

console.log(' RESTful API server started on: ' + port);

module.exports = app;