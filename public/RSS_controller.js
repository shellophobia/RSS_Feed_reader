var RSSModel = require('./RSS_model');

var RSSController = function(app) {
  app.get('/', function(req, res) {
    RSSModel.fetchData(function(xml) {
      res.render('./index', {
        xml: xml
      });
    });
  });
}

module.exports.controller = RSSController;