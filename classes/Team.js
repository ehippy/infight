let db = require('./db');
let dyna = require('./dynamoose/dynaTeam');

class Team {
    constructor(domain, name, img) {
        this.domain =  domain;
        this.name = name;
        this.img = img;
        this.users = [];
        this.created = Date.now();
        this.currentGameNum = null;
    }

    static get(id, cb) {

        dyna.get( {id: id});

        db.doc.getItem({TableName: db.TABLE_NAME_TEAMS, Key: {domain: id}}, function (err, data) {
            if (err) {
                cb(err, null);
            }
            let t = new Team();
            for (let p in data.Item) {t[p] = data.Item[p];}
            cb(err, t);
        });
    }

    save(cb) {
        db.doc.putItem({TableName: db.TABLE_NAME_TEAMS, Item: this}, function (err, data) {
            cb(err, data);
        });
    };
}

module.exports = Team;