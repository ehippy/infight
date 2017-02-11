var dynamoose = require('dynamoose');

var Team = dynamoose.model('Team', {
    id: Number,
    name: String,
    domain: String,
    img: String,
    users: [Object]
});



module.exports = Team;



