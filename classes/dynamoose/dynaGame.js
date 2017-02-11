var dynamoose = require('dynamoose');

var Game = dynamoose.model('Game', {
    domain: Number,
    name: String,

});



module.exports = Game;



