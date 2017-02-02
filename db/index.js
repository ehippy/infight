var AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8080"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new DOC.DynamoDB(dynamodb);

var ensureTable = function (params) {
    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
};

ensureTable({
    TableName: "TankTeams",
    KeySchema: [
        {AttributeName: "name", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        {AttributeName: "name", AttributeType: "S"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
    }
});

ensureTable({
    TableName: "TankGames",
    KeySchema: [
        {AttributeName: "team", KeyType: "HASH"},
        {AttributeName: "num", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "name", AttributeType: "S"},
        {AttributeName: "num", AttributeType: "N"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
    }
});


var db = {};


module.exports = db;