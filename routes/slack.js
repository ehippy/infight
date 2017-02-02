var express = require('express');
var router = express.Router();
var request = require('request');


/* GET users listing. */
router.get('/auth', function(req, res, next) {

    if (!req.query.code) {
        res.send('Slack login failed, try again');
    }

    var uri = 'https://slack.com/api/oauth.access' +
        '?client_id=' + process.env.SLACK_OAUTH_CLIENT_ID +
        '&client_secret=' + process.env.SLACK_OAUTH_CLIENT_SECRET +
        '&code=' + req.query.code;

    request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var message = JSON.parse(body);
            console.log(message);



        } else {
            res.send('Slack login failed, try again');
        }
    })


});

module.exports = router;
