var express = require('express');
var router = express.Router();
var request = require('request');
var teams = require('../classes/team');

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

            var user = {
                id: message.user.id,
                name: message.user.name,
                img: message.user.image_48,

                team_id: message.team.id,
                team_name: message.team.name,
                team_domain: message.team.domain,
                team_img: message.team.image_102
            };

            res.cookie('slackUser',user, { maxAge: 900000, httpOnly: true, signed: true});
            res.redirect('/');

            teams.get(user.team_id, function(err, team) {
                if (err) {
                    res.send('Slack login failed, try again');
                }
                team = team.Item;
                if (team.id != user.team_id) {
                    console.log('Team not found, creating new...');
                    team = teams.scaffold(user.team_id, user.team_domain, user.team_name, user.team_img);
                    teams.save(team, function(err, data){
                        console.log("Team creation save: ", err, data);
                    });
                }

                var foundUser = false;
                for (var i=0;i<team.users.length;i++) {
                    if (team.users[i].id == user.id){
                        foundUser = true;
                        break;
                    }
                }
                if (!foundUser) {
                    team.users.push({
                        id: user.id,
                        name: user.name,
                        img: user.img
                    });
                    teams.save(team, function(err, data){
                        console.log("Team user-append save: ", err, data);
                    });
                }
            });


        } else {
            res.send('Slack login failed, try again');
        }
    })


});

module.exports = router;
