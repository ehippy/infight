let express = require('express');
let router = express.Router();
let request = require('request');
let Team = require('../classes/Team');
let User = require('../classes/User');

router.get('/auth', function(req, res, next) {

    if (!req.query.code) {
        res.send('Slack login failed, try again');
    }

    let uri = 'https://slack.com/api/oauth.access' +
        '?client_id=' + process.env.SLACK_OAUTH_CLIENT_ID +
        '&client_secret=' + process.env.SLACK_OAUTH_CLIENT_SECRET +
        '&code=' + req.query.code;

    request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let message = JSON.parse(body);

            if (!message.ok) {
                return res.send('Slack login failed, try again');
            }

            let user = {
                id: message.user.id,
                name: message.user.name,
                img: message.user.image_48,

                team_id: message.team.id,
                team_name: message.team.name,
                team_domain: message.team.domain,
                team_img: message.team.image_102
            };

            res.cookie('slackUser',user, { maxAge: 900000, httpOnly: true, signed: true});
            res.redirect('/team/' + user.team_domain);

            Team.get(user.team_domain, function(err, userTeam) {
                if (err) {
                    return res.send('Slack login failed, try again');
                }

                if (userTeam === undefined || userTeam.domain != user.team_domain) {
                    console.log('Team not found, creating new...');
                    userTeam = new Team(user.team_domain, user.team_name, user.team_img);
                    userTeam.save(function(err, data){
                        console.log("Team creation save: ", err, data);
                    });
                }

                let foundUser = false;
                for (let i=0;i<userTeam.users.length;i++) {
                    if (userTeam.users[i].id == user.id){
                        foundUser = true;
                        break;
                    }
                }
                if (!foundUser) {
                    userTeam.users.push(new User(user.id, user.name, user.img, user.team_domain));
                    userTeam.save(function(err, data){
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
