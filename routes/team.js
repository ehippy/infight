let express = require('express');
let router = express.Router();
let team = require('../classes/team');


router.get('/:team_domain', function(req, res, next) {
    team.get(req.params.team_domain, function(err, team) {
        res.render('team', { team: team });
    });
});

router.get('/:team_id/:game_num', function(req, res, next) {
    res.render('game', { title: 'Team Tanks' });
});

module.exports = router;
