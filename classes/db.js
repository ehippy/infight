var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8080"
});

var dynamodb = new AWS.DynamoDB();
var db = {};

db.TABLE_NAME_TEAMS = "TankTeams";
db.TABLE_NAME_GAMES = "TankGames";

db.init = function() {

    var ensureTable = function (params) {
        dynamodb.createTable(params, function (err, data) {
            if (err) {

                if (err.code == 'ResourceInUseException') {
                    console.log("Table exists: " + params.TableName);
                    return;
                }
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
            }
        });
    };

    ensureTable({
        TableName: db.TABLE_NAME_TEAMS,
        KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}
        ],
        AttributeDefinitions: [
            {AttributeName: "id", AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        }
    });

    ensureTable({
        TableName: db.TABLE_NAME_GAMES,
        KeySchema: [
            {AttributeName: "team_id", KeyType: "HASH"},
            {AttributeName: "num", KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName: "team_id", AttributeType: "S"},
            {AttributeName: "num", AttributeType: "N"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        }
    });
};

db.doc = new DOC.DynamoDB(dynamodb);
db.dynamo = dynamodb;

module.exports = db;