
class Move {

    static actionShoot = 'shoot';
    static actionMove = 'move';
    static actionGive = 'give';

    constructor(unit, action, x, y) {
        this.unit = unit;
        this.action = action;
        this.x = x;
        this.y = y;
    }
}

module.exports = Move;