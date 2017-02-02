var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (!req.signedCookies.slackUser) {
      res.status(404).send('Not found');
  }
  res.send(req.signedCookies.slackUser);
});

module.exports = router;
