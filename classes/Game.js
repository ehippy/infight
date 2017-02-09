let db = require('./db');
let Unit = require('./unit');
let Move = require('./move');


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

    giveAP(cb) {
        for (let u in this.players) {
            this.players[u].ap+=1;
        }

        this.save(function(err, data) {
            cb(err, this);
        });
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

    static getThemShits(domain, num, someCB) {
        db.doc.getItem({TableName: db.TABLE_NAME_GAMES, Key: {domain: domain, num: num}}, function(err, data){
            someCB(err, data.Item);
        });
    };

    move(mv, cb) {

        this.validateMove(mv, function(err, valid){
            if (err) {
                return cb(err, this);
            }


            this.performMove(mv, function(err, cb) {

            });
        });

    }

    performMove(move, f) {


        switch (move.action) {
            case Move.actionMove:

                for (let u in this.players) {
                    if (this.players[u].id == move.unit.id) {
                        this.players[u].x = move.targetX;
                        this.players[u].y = move.targetY;

                        this.save(function(err, data) {
                            return cb(err, data);
                        });
                    }
                }

            break;
        }
    }

    save(cb) {
        db.doc.putItem({TableName: db.TABLE_NAME_GAMES, Item: this}, function(err, data){
            cb(err,data);
        });
    };

    validateMove(move, cb) {

        if (!cb) {
            return;
        }

        if (!Move.isValid(move)) {
            return cb("Move missing required fields", false);
        }

        let playerUnit = null;
        for(let u in this.players) {
            if (u.unit.id == move.unit.id) {
                playerUnit = u;
            }
        }

        if (playerUnit == null) {
            return cb("Player not part of game", false);
        }

        switch (move.action) {
            case Move.actionMove:
                if (!this.isMoveOnBoard(move))
                    return cb("Move off the board", false);
                if (!this.isSpaceOccupied(move.targetX, move.targetY))
                    return cb("Space is occupied", false);
                if (!this.isWithinRadius(1, originX, originY, targetX, targetY))
                    return cb("Move out of range.", false);

                return cb(null, true);
                break;
        }
    }

    isMoveOnBoard(move) {
        return 0 <= move.x < this.boardWidth && 0 <= move.y < this.boardWidth - 1;
    }

    isSpaceOccupied(targetX, targetY) {
        for (let u in this.players) {
            if (u.x == targetX && u.y == targetY) {
                return true;
            }
        }
        return false;
    }

    isWithinRadius(radius, originX, originY, targetX, targetY) {
        if (targetX < originX - radius || targetX > originX + radius) return false;
        if (targetY < originY - radius || targetY > originY + radius) return false;
        return true;
    }
}


module.exports = Game;