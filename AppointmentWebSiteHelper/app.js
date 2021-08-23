var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(event));
    var params = {
        TableName: process.env.APPOINTMENT_TABLE,
        Item: {
            'patientId': event.patientId,
            'appointmentDateTime': event.appointmentDateTime
        }
    };

    ddb.put(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(null, { customError: 'Error adding item: ' + JSON.stringify(err, null, 2) });
        } else {
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
                },
                body: JSON.stringify(data)
            };
            callback(null, response);
        }
    });
};