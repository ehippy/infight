let db = require('./db');

let team = {};

team.scaffold = function (domain, name, img) {
    return {
        domain: domain,
        name: name,
        img: img,
        users: [],
        created: Date.now()
    };
};

team.get = function (team_domain, cb) {
    db.doc.getItem({TableName: db.TABLE_NAME_TEAMS, Key: {domain: team_domain}}, function (err, data) {
        cb(err, data.Item);
    });
};

team.save = function (team, cb) {
    db.doc.putItem({TableName: db.TABLE_NAME_TEAMS, Item: team}, function (err, data) {
        cb(err, data);
    });
};

module.exports = team;