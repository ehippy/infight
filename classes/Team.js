let db = require('./db');

class Team {
    constructor(domain, name, img) {
        this.domain =  domain;
        this.name = name;
        this.img = img;
        this.users = [];
        this.created = Date.now();
        this.currentGameNum = null;
    }

    static get(team_domain, cb) {
        db.doc.getItem({TableName: db.TABLE_NAME_TEAMS, Key: {domain: team_domain}}, function (err, data) {
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