let express = require('express');
let router = express.Router();
let Team = require('../classes/team');
let Game = require('../classes/game');
let User = require('../classes/user');


router.get('/:team_domain', function(req, res, next) {
    Team.get(req.params.team_domain, function(err, team) {
        res.render('team', { team: team });
    });
});

router.get('/:team_domain/game/:game_num', function(req, res, next) {
    Game.getThemShits(req.params.team_domain, parseInt(req.params.game_num), function(err, game) {
        res.render('game', game);
    });
});

router.get('/:team_domain/game/:game_num/json', function(req, res, next) {
    Game.getThemShits(req.params.team_domain, parseInt(req.params.game_num), function(err, game) {
        res.send(game);
    });
});

router.get('/:team_domain/game/:game_num/json', function(req, res, next) {
    Game.getThemShits(req.params.team_domain, parseInt(req.params.game_num), function(err, game) {
        game.giveAP(function(err, game){
            res.send(game);
        });
    });
});

router.post('/:team_domain/game/:game_num/move', function(req, res, next) {
    Game.getThemShits(req.params.team_domain, parseInt(req.params.game_num), function(err, game) {

        if (!req.body.unit || !req.body.unit.user) {
            return res.status(400).send('Move missing user information');
        }
        if (res.locals.user.id != req.body.unit.user.id) {
            return res.status(400).send('Move user is not logged in');
        }

        game.move(req.body, function(err, gameAfterMove) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(gameAfterMove);
        });
    });
});

router.get('/:team_domain/fakebro/:name', function(req, res, next) {
    Team.get(req.params.team_domain, function(err, team) {
        team.users.push(new User(Math.random(), req.params.name, 'adf', req.params.team_domain));
        team.save(function(err, data){
            res.redirect(`/team/${req.params.team_domain}/`);
        });
    });
});

router.get('/:team_domain/startGame', function(req, res, next) {


    Team.get(req.params.team_domain, function(err, team) {

        if (err) {
            return res.status(500).send(err);
        }

        if (team.currentGameNum) {
            return res.status(500).send('There is already a game on');
        }

        if (!res.locals.user || res.locals.user.team_domain != req.params.team_domain) {
            return res.status(500).send('This isn\'t your team!');
        }

        if (team.users.length < 2) {
            return res.status(500).send('Not enough players yet to start a game.');
        }

        let newGame = new Game(team);
        newGame.save(function(err, data){

            if (err) {
                return res.status(500).send(err);
            }

            team.currentGameNum = newGame.num;
            team.save(function(err, data){
                res.redirect(`/team/${req.params.team_domain}/`);
            });

        });
    });
});

module.exports = router;
