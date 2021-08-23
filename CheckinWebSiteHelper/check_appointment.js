var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log("Event:" + JSON.stringify(event));
  var patientId = event.Details.Parameters.patientId;
  var date = new Date();
  // epoch in seconds
  var epoch = date.getTime()/1000;
  console.log('now is ' + epoch.toString());
  var paramsQuery = {
    TableName: process.env.APPOINTMENT_TABLE,
    KeyConditionExpression: "patientId = :varNumber AND appointmentDateTime > :varDate",
    ExpressionAttributeValues: { ":varNumber": patientId, ":varDate": epoch }
  };

  docClient.query(paramsQuery, function(err, data) {
    if (err) {
      console.log(err);
      callback(null, buildResponse(false));
    }
    else {
      console.log("DynamoDB Query Results:" + JSON.stringify(data));

      if (data.Items.length === 0) {
        console.log("Customer not Found in PatientAppointment table");
        var recordFound = "False";
        callback(null, buildResponse(true, recordFound));
      }
      else {
        recordFound = "True";
        var refUrl = event.Details.ContactData.References.Referrer.Value;
        var delta = 0;
        if (data.Items[0].appointmentDateTime)
        {
          // calculate the time between now and the appointment minus 2 minutes for the push in front
          // returned value is in minutes
            delta = Math.round((data.Items[0].appointmentDateTime - epoch)) - 120;
        }
        callback(null, buildResponse(true, recordFound, refUrl, delta));
      }
    }
  });
};

function buildResponse(isSuccess, recordFound, refUrl, delta) {
  if (isSuccess) {
    return {
      recordFound: recordFound,
      refUrl: refUrl,
      delta: delta,
      lambdaResult: "Success"
    };
  }
  else {
    console.log("Lambda returned error to Connect");
    return { lambdaResult: "Error" };
  }
}