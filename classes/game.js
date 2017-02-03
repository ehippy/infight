let db = require('./db');
let Unit = require('./unit');

let game = {};

game.new = function(team) {

    let gameState = {
        team_id: team.id,
        num: new Math.round(Date.now()/1000),

        boardHeight: 10,
        boardWidth: 10,

        actionPointDistributionIntervalSeconds: 60*60*24,
        nextActionPointDistributionTimeStamp: (new Date.now()) + 60*60*24,

        players: []

    };

    for (let i=0;i<team.users.length;i++) {

        let x, y;

        for(let ol = 0;ol<gameState.boardWidth*gameState.boardHeight;i++) {

            x = Math.floor(Math.random()*gameState.boardWidth);
            y = Math.floor(Math.random()*gameState.boardHeight);

            let collision = false;

            for (let pl = 0;pl<gameState.players.length;pl++) {
                let otherP = gameState.players[pl];
                if (x == otherP.x && y == otherP.y) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                break;
            }
        }


        gameState.players.push(
            new Unit(team.users[i], x, y)
        );
    }

    return gameState;
};

game.get = function(team_id, cb) {
    db.doc.getItem({TableName: db.TABLE_NAME_GAMES, Key: {id: team_id}}, function(err, data){
        cb(err,data.Item);
    });
};

game.save = function(team, cb) {
    db.doc.putItem({TableName: db.TABLE_NAME_GAMES, Item: team}, function(err, data){
        cb(err,data);
    });
};

module.exports = game;