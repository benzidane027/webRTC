var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api', api);



module.exports = app;
