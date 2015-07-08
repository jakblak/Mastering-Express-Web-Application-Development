var express = require('express');
var router = express.Router();

var secrets = require('../secrets');

var ig = require('instagram-node').instagram();
ig.use({
  client_id: secrets.ID,
  client_secret: secrets.secret
});

/* GET home page. */
router.get('/', function(req, res, next) {
    ig.media_popular(function(err, media, limit) {
      if (err) {
        throw err;
      }
      var urls = [];
      for (var i = 0; i < media.length; i++) {
        urls.push(media[i].images.standard_resolution.url);
      }
      res.render('popular', {
        urls: urls
      });
    });
});
    module.exports = router;