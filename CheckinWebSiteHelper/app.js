var AWS = require('aws-sdk');
const connect = new AWS.Connect();
const fs = require('fs');

exports.handler = function (event, context, callback) {
    console.log(event);
    var params = {
        ContactFlowId: process.env.CONTACT_FLOW_ID,
        InstanceId: process.env.CONNECT_INSTANCE_ID,
        Name: 'New check-in',
        Attributes: { "Name" : event.name , "BirthDay" : event.birthday, "PatientNumber": event.patientnumber, "TestType": event.testtype, "Phone": event.phone, "IsOnlineAppoinment":event.onlineappointment},
        ClientToken: uuidv4(),
        Description: 'Patient Information',
        References: {"Referrer" : {"Value" : "https://amazon.care/", "Type": "URL"}}
      };
      connect.startTaskContact(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
            console.log(data);           // successful response
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


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}