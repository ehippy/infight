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

            var slackUser = {
                id: message.user.id,
                name: message.user.name,
                img: message.user.image_48,

                team_id: message.team.id,
                team_name: message.team.name,
                team_domain: message.team.domain,
                team_img: message.team.image_48
            };

            res.cookie('slackUser',slackUser, { maxAge: 900000, httpOnly: true, signed: true});
            res.redirect('/');

        } else {
            res.send('Slack login failed, try again');
        }
    })


});

module.exports = router;
