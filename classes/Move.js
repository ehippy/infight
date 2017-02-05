
class Move {

    static actionShoot = 'shoot';
    static actionMove = 'move';
    static actionGive = 'give';
    static actionVote = 'vote';

    constructor(unit, action, x, y) {
        this.unit = unit;
        this.action = action;
        this.x = x;
        this.y = y;
    }
}

module.exports = Move;