var db = require('./db');

var team = {};

team.scaffold = function(id, domain, name, img) {
    return {
        id: id,
        domain: domain,
        name: name,
        img: img,
        users: [],
        created: Date.now()
    };
};

team.get = function(team_id, cb) {
    db.doc.getItem({TableName: db.TABLE_NAME_TEAMS, Key: {id: team_id}}, function(err, data){
        cb(err,data);
    });
};

team.save = function(team, cb) {
    db.doc.putItem({TableName: db.TABLE_NAME_TEAMS, Item: team}, function(err, data){
        cb(err,data);
    });
};

module.exports = team;