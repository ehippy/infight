let db = require('./db');
let Unit = require('./unit');


class Game {
    constructor(teamForGame) {
        this.domain = teamForGame.domain;
        this.team = teamForGame;
        this.num = Math.round(Date.now()/1000);
        this.boardHeight = 10;
        this.boardWidth = 10;

        this.actionPointDistributionIntervalSeconds = 60*60*24;
        this.nextActionPointDistributionTimeStamp = this.num+this.actionPointDistributionIntervalSeconds;

        this.players= [];
        this.setPlayerStartingPositions(this.team);

    }

    setPlayerStartingPositions(team) {
        for (let i = 0; i < team.users.length; i++) {

            let x, y;

            for (let ol = 0; ol < this.boardWidth * this.boardHeight; i++) {

                x = Math.floor(Math.random() * this.boardWidth);
                y = Math.floor(Math.random() * this.boardHeight);

                let collision = false;

                for (let pl = 0; pl < this.players.length; pl++) {
                    let otherP = this.players[pl];
                    if (x == otherP.x && y == otherP.y) {
                        collision = true;
                        break;
                    }
                }

                if (!collision) {
                    break;
                }
            }


            this.players.push(
                new Unit(team.users[i], x, y)
            );
        }
    }

    static getThemShits(domain, num, cb) {
        db.doc.getItem({TableName: db.TABLE_NAME_GAMES, Key: {domain: domain, num: num}}, function(err, data){
            cb(err, data.Item);
        });
    };

    save(cb) {
        db.doc.putItem({TableName: db.TABLE_NAME_GAMES, Item: this}, function(err, data){
            cb(err,data);
        });
    };
}


module.exports = Game;