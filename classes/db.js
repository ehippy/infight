let AWS = require("aws-sdk");
let DOC = require("dynamodb-doc");

AWS.config.update({
    accessKeyId: 'b',
    secretAccessKey: 's',
    region: "us-east-1",
    endpoint: "http://localhost:8080"
});

let dynamodb = new AWS.DynamoDB();
let db = {};

db.TABLE_NAME_TEAMS = "TankTeams";
db.TABLE_NAME_GAMES = "TankGames";

db.init = function() {

    let ensureTable = function (params) {
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
            {AttributeName: "domain", KeyType: "HASH"}
        ],
        AttributeDefinitions: [
            {AttributeName: "domain", AttributeType: "S"}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        }
    });

    ensureTable({
        TableName: db.TABLE_NAME_GAMES,
        KeySchema: [
            {AttributeName: "domain", KeyType: "HASH"},
            {AttributeName: "num", KeyType: "RANGE"}
        ],
        AttributeDefinitions: [
            {AttributeName: "domain", AttributeType: "S"},
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