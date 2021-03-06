var express = require('express');
var router = express.Router();
var secrets = require('../secrets');
var ig = require('instagram-node').instagram();

ig.use({
  client_id: secrets.ID,
  client_secret: secrets.secret
});

var pop_cache = {};

function get_most_popular(cb) {

  var timeout = 10;

  if(pop_cache.media && (new Date).getTime() < pop_cache.timeout) {
    return cb(null, pop_cache.media, pop_cache.limit);
  }
  ig.media_popular(function(err, media, limit) {
    pop_cache = {
      media: media,
      limit: limit,
      timeout: (+(new Date())) + (timeout * 1000)
    }
    return cb(err, media, limit);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    get_most_popular(function(err, media, limit) {
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