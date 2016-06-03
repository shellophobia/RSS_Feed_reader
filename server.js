var express = require('express');

var app = express();

app.set('view engine', 'ejs');

var RSSController = require('./public/RSS_controller');
RSSController.controller(app);

app.use(express.static(__dirname + '/public'));

app.listen(8080);