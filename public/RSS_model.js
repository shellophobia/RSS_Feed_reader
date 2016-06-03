var https = require('https');

var RSSModel = {
  xml : '',
  fetchData: function(successCB) {
    https.get('https://www.reddit.com/.rss', function(response) {
      if (response.statusCode >= 200 || response.statusCode < 400) {
        response.on('data', function(data) {
          RSSModel.xml += data.toString();
        });
        response.on('end', function() {
          successCB(RSSModel.xml);
        });
      }
    });
  }
}

module.exports = RSSModel;