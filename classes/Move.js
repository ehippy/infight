

class Move {


    constructor(unit, action, targetX, targetY) {
        this.unit = unit;
        this.action = action;
        this.x = targetX;
        this.y = targetY;
    }

    static isValid(move) {
        if (!move.unit || !move.action || !move.targetX || !move.targetY) {
            return false;
        }
        return true;
    }
}

Move.actionShoot = 'shoot';
Move.actionMove = 'move';
Move.actionGive = 'give';
Move.actionVote = 'vote';

module.exports = Move;