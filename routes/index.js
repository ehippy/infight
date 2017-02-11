let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Infight' });
});
/* GET home page. */
router.get('/logout', function(req, res, next) {
    res.clearCookie('slackUser');
    res.redirect('/');
});

module.exports = router;
