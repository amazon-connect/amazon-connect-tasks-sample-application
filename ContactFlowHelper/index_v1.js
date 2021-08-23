'use strict';
console.log('Loading function');
const https = require('https');
const url = require('url');
var AWS = require('aws-sdk');
var connect = new AWS.Connect();

exports.handler = (event, context, callback) => {
    console.log('Received Event from CFT:', JSON.stringify(event));
    let responseStatus = 'FAILED';
    let responseData = {};
    if (event.RequestType === 'Create') {
        console.log('Creating Queue for General diagnostic test ...');

        var createQueueForGeneralDiagnosticTestParams = {
            HoursOfOperationId: process.env.OPERATING_HOURS_ID, // PARAMETER
            InstanceId: process.env.CONNECT_INSTANCE_ID, // PARAMETER
            Name: event.ResourceProperties.GENERAL_DIAGNOSTIC_TEST_QUEUE_NAME // PARAMETER
        };
        connect.createQueue(createQueueForGeneralDiagnosticTestParams, function (err, data) {
            if (err) {
                responseData = {
                    Error: 'Create Queue operation failed for' + Name
                };
                console.log(err, err.stack); // an error occurred
                sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
            }
            else {
                var GeneralDiagnosticTestQueueId = data.QueueId;
                var GeneralDiagnosticTestQueueArn = data.QueueArn;
                var createQueueForGeneticTestParams = {
                    HoursOfOperationId: process.env.OPERATING_HOURS_ID, // PARAMETER
                    InstanceId: process.env.CONNECT_INSTANCE_ID, // PARAMETER
                    Name: event.ResourceProperties.GENETIC_TEST_QUEUE_NAME // PARAMETER
                };
                connect.createQueue(createQueueForGeneticTestParams, function (err, data) {
                    if (err) {
                        responseData = {
                            Error: 'Create Queue operation failed for' + Name
                        };
                        console.log(err, err.stack); // an error occurred
                        sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                    }
                    else {
                        var GeneticTestQueueId = data.QueueId;
                        var GeneticTestQueueArn = data.QueueArn;
                        var createQueueForNaturopathicTestParams = {
                            HoursOfOperationId: process.env.OPERATING_HOURS_ID, // PARAMETER
                            InstanceId: process.env.CONNECT_INSTANCE_ID, // PARAMETER
                            Name: event.ResourceProperties.NATUROPATHIC_TEST_QUEUE_NAME // PARAMETER
                        };
                        connect.createQueue(createQueueForNaturopathicTestParams, function (err, data) {
                            if (err) {
                                responseData = {
                                    Error: 'Create Queue operation failed for' + Name
                                };
                                console.log(err, err.stack); // an error occurred
                                sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                            }
                            else {
                                var NaturopathicTestQueueId = data.QueueId;
                                var NaturopathicTestQueueArn = data.QueueArn;
                                var createQueueForHeartMonitoringTestParams = {
                                    HoursOfOperationId: process.env.OPERATING_HOURS_ID, // PARAMETER
                                    InstanceId: process.env.CONNECT_INSTANCE_ID, // PARAMETER
                                    Name: event.ResourceProperties.HEART_MONITORING_TEST_QUEUE_NAME // PARAMETER
                                };
                                connect.createQueue(createQueueForHeartMonitoringTestParams, function (err, data) {
                                    if (err) {
                                        responseData = {
                                            Error: 'Create Queue operation failed for' + Name
                                        };
                                        console.log(err, err.stack); // an error occurred
                                        sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                                    }
                                    else {
                                        var HeartMonitoringTestQueueId = data.QueueId;
                                        var HeartMonitoringTestQueueArn = data.QueueArn;
                                        console.log(JSON.stringify(data));           // successful response

                                        var params = {
                                            InstanceId: process.env.CONNECT_INSTANCE_ID, /* required */
                                            QueueConfigs: [ /* required */
                                              {
                                                Delay: 0, /* required */
                                                Priority: 1, /* required */
                                                QueueReference: { /* required */
                                                  Channel: 'TASK', /* required */
                                                  QueueId: GeneralDiagnosticTestQueueId /* required */
                                                }
                                              },
                                              {
                                                Delay: 0, /* required */
                                                Priority: 1, /* required */
                                                QueueReference: { /* required */
                                                  Channel: 'TASK', /* required */
                                                  QueueId: GeneticTestQueueId /* required */
                                                }
                                              },
                                              {
                                                Delay: 0, /* required */
                                                Priority: 1, /* required */
                                                QueueReference: { /* required */
                                                  Channel: 'TASK', /* required */
                                                  QueueId: NaturopathicTestQueueId /* required */
                                                }
                                              },
                                              {
                                                Delay: 0, /* required */
                                                Priority: 1, /* required */
                                                QueueReference: { /* required */
                                                  Channel: 'TASK', /* required */
                                                  QueueId: HeartMonitoringTestQueueId /* required */
                                                }
                                              }
                                              /* more items */
                                            ],
                                            RoutingProfileId: process.env.ROUTING_PROFILE_ID /* required */
                                          };

                                        connect.associateRoutingProfileQueues(params, function (err, data) {
                                            if (err) {
                                                responseData = {
                                                    Error: 'Associate Routing Profile Queues operation failed'
                                                };
                                                console.log(err, err.stack); // an error occurred
                                                sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                                            }
                                            else {
                                                console.log(JSON.stringify(data));           // successful response
                                                var lambdaFunctionARN = event.ResourceProperties.CHECK_PATIENT_APPOINTMENT_LAMBDA_FUNCTION_ARN;
                                                var params = {
                                                    Content: '{\"Version\":\"2019-10-30\",\"StartAction\":\"608aa94d-95b8-488c-b5bd-5af603536237\",\"Metadata\":{\"entryPointPosition\":{\"x\":20,\"y\":20},\"snapToGrid\":false,\"ActionMetadata\":{\"608aa94d-95b8-488c-b5bd-5af603536237\":{\"position\":{\"x\":161,\"y\":20}},\"55c54dde-f982-4f92-aa82-f7356b348559\":{\"position\":{\"x\":1736,\"y\":410}},\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\":{\"position\":{\"x\":1720,\"y\":15},\"useDynamic\":false},\"2ede9922-db02-4010-aaf7-c82afdfec58d\":{\"position\":{\"x\":1527,\"y\":396},\"useDynamic\":false},\"c533e8bb-e1a4-4df0-9910-765e1684dff6\":{\"position\":{\"x\":1075,\"y\":6},\"dynamicMetadata\":{\"patientId\":false},\"useDynamic\":false},\"2a46e47c-5957-4e98-a1e4-dcffa169a84b\":{\"position\":{\"x\":1201,\"y\":423},\"useDynamic\":false,\"queue\":{\"id\":\"' + GeneticTestQueueArn + '\",\"text\":\"Genetic CheckIn\"}},\"02aeee64-9212-404b-98a6-7f8692ff77f5\":{\"position\":{\"x\":892,\"y\":433},\"useDynamic\":false,\"queue\":{\"id\":\"' + HeartMonitoringTestQueueArn + '\",\"text\":\"Heart CheckIn\"}},\"bbc25229-b243-4f8a-b635-5b10111292d3\":{\"position\":{\"x\":898,\"y\":644},\"useDynamic\":false,\"queue\":{\"id\":\"' + NaturopathicTestQueueArn + '\",\"text\":\"Naturopathic CheckIn\"}},\"a20018d2-663c-464e-abe7-275c02ed00af\":{\"position\":{\"x\":1203,\"y\":618},\"useDynamic\":false,\"queue\":{\"id\":\"' + GeneralDiagnosticTestQueueArn + '\",\"text\":\"General CheckIn\"}},\"39bbbd66-b78f-4dbb-a733-d159062b5c7c\":{\"position\":{\"x\":1308,\"y\":22}},\"0f2c476d-ca85-4890-b36f-03109a4f1f4d\":{\"position\":{\"x\":103,\"y\":217},\"conditionMetadata\":[{\"id\":\"6fa6fb58-bcec-4819-98ed-70eb790f6152\",\"operator\":{\"name\":\"Equals\",\"value\":\"Equals\",\"shortDisplay\":\"=\"},\"value\":\"Success\"}]},\"7b1b04f8-fa4b-4146-b567-0ff27c0c7d56\":{\"position\":{\"x\":847,\"y\":5},\"conditionMetadata\":[{\"id\":\"efa0f067-d7e0-4d08-82a5-785281adce68\",\"operator\":{\"name\":\"Equals\",\"value\":\"Equals\",\"shortDisplay\":\"=\"},\"value\":\"1\"}]},\"c4a670f1-01cc-4f57-952c-b5ce1cb8acdd\":{\"position\":{\"x\":401,\"y\":4},\"conditionMetadata\":[{\"id\":\"a8d33d08-cf2d-480b-81c2-ba487a12d54d\",\"operator\":{\"name\":\"Equals\",\"value\":\"Equals\",\"shortDisplay\":\"=\"},\"value\":\"TASK\"}]},\"a123b218-b7e0-4531-93df-c724c3dbf2e6\":{\"position\":{\"x\":621,\"y\":7}},\"b9995749-67df-4fd5-9859-4a6e512b4f35\":{\"position\":{\"x\":1515,\"y\":183},\"adjustUnit\":\"minutes\"},\"3ce966a6-a751-4a72-892c-11c259513d47\":{\"position\":{\"x\":1223,\"y\":209},\"useDynamic\":true},\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\":{\"position\":{\"x\":141,\"y\":554},\"conditionMetadata\":[{\"id\":\"d8ce07f9-5eb7-4ed0-88c5-eb6545be7a2c\",\"operator\":{\"name\":\"Contains\",\"value\":\"Contains\",\"shortDisplay\":\"contains\"},\"value\":\"General\"},{\"id\":\"404a9697-86ca-4f9d-93a3-78579e24ed26\",\"operator\":{\"name\":\"Contains\",\"value\":\"Contains\",\"shortDisplay\":\"contains\"},\"value\":\"Genetic\"},{\"id\":\"7f0a614f-7fed-4a20-ab7d-c354e14a8a77\",\"operator\":{\"name\":\"Contains\",\"value\":\"Contains\",\"shortDisplay\":\"contains\"},\"value\":\"Naturopathic\"},{\"id\":\"ec1a7384-dc6d-4771-9a36-a4d4693d780f\",\"operator\":{\"name\":\"Contains\",\"value\":\"Contains\",\"shortDisplay\":\"contains\"},\"value\":\"Heart\"}]},\"b72bc9a7-c671-414d-a780-f27ddbe2805a\":{\"position\":{\"x\":328,\"y\":207},\"conditionMetadata\":[{\"id\":\"1c73acb7-7f25-4a10-a6f4-4ebf0504322c\",\"operator\":{\"name\":\"Equals\",\"value\":\"Equals\",\"shortDisplay\":\"=\"},\"value\":\"True\"}]},\"1feef092-ada4-4f41-bc58-8360df20168f\":{\"position\":{\"x\":721,\"y\":209},\"conditionMetadata\":[{\"id\":\"6071024f-fc23-45a7-a1cf-49bcb4c47e86\",\"operator\":{\"name\":\"Is greater than\",\"value\":\"GreaterThan\",\"shortDisplay\":\">\"},\"value\":\"0\"}]},\"c60d7873-0723-4670-9540-48cc645d6ae6\":{\"position\":{\"x\":954,\"y\":207},\"conditionMetadata\":[{\"id\":\"ac7f6a85-9505-4bfc-8211-76f8f3c33108\",\"operator\":{\"name\":\"Is less than\",\"value\":\"LessThan\",\"shortDisplay\":\"<\"},\"value\":\"15\"}]}}},\"Actions\":[{\"Identifier\":\"608aa94d-95b8-488c-b5bd-5af603536237\",\"Parameters\":{\"FlowLoggingBehavior\":\"Enabled\"},\"Transitions\":{\"NextAction\":\"c4a670f1-01cc-4f57-952c-b5ce1cb8acdd\",\"Errors\":[],\"Conditions\":[]},\"Type\":\"UpdateFlowLoggingBehavior\"},{\"Identifier\":\"55c54dde-f982-4f92-aa82-f7356b348559\",\"Type\":\"DisconnectParticipant\",\"Parameters\":{},\"Transitions\":{}},{\"Identifier\":\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\",\"Transitions\":{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"Errors\":[{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"NoMatchingError\"},{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"QueueAtCapacity\"}],\"Conditions\":[]},\"Type\":\"TransferContactToQueue\"},{\"Identifier\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"Parameters\":{\"Text\":\"An error has occurred\"},\"Transitions\":{\"NextAction\":\"55c54dde-f982-4f92-aa82-f7356b348559\",\"Errors\":[],\"Conditions\":[]},\"Type\":\"MessageParticipant\"},{\"Identifier\":\"c533e8bb-e1a4-4df0-9910-765e1684dff6\",\"Parameters\":{\"LambdaFunctionARN\":\"' + lambdaFunctionARN + '\",\"InvocationTimeLimitSeconds\":\"3\",\"LambdaInvocationAttributes\":{\"patientId\":\"$.Attributes.PatientNumber\"}},\"Transitions\":{\"NextAction\":\"39bbbd66-b78f-4dbb-a733-d159062b5c7c\",\"Errors\":[{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"InvokeLambdaFunction\"},{\"Identifier\":\"2a46e47c-5957-4e98-a1e4-dcffa169a84b\",\"Parameters\":{\"QueueId\":\"' + GeneticTestQueueArn + '\"},\"Transitions\":{\"NextAction\":\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\",\"Errors\":[{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactTargetQueue\"},{\"Identifier\":\"02aeee64-9212-404b-98a6-7f8692ff77f5\",\"Parameters\":{\"QueueId\":\"' + HeartMonitoringTestQueueArn + '\"},\"Transitions\":{\"NextAction\":\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\",\"Errors\":[{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactTargetQueue\"},{\"Identifier\":\"bbc25229-b243-4f8a-b635-5b10111292d3\",\"Parameters\":{\"QueueId\":\"' + NaturopathicTestQueueArn + '\"},\"Transitions\":{\"NextAction\":\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\",\"Errors\":[{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactTargetQueue\"},{\"Identifier\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"Parameters\":{\"QueueId\":\"' + GeneralDiagnosticTestQueueArn + '\"},\"Transitions\":{\"NextAction\":\"1ba4dd2f-453b-4b8e-99f6-96f57c434691\",\"Errors\":[{\"NextAction\":\"2ede9922-db02-4010-aaf7-c82afdfec58d\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactTargetQueue\"},{\"Identifier\":\"39bbbd66-b78f-4dbb-a733-d159062b5c7c\",\"Parameters\":{\"Attributes\":{\"testType\":\"$.Attributes.TestType\",\"refUrl\":\"$.External.refUrl\"}},\"Transitions\":{\"NextAction\":\"0f2c476d-ca85-4890-b36f-03109a4f1f4d\",\"Errors\":[{\"NextAction\":\"0f2c476d-ca85-4890-b36f-03109a4f1f4d\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactAttributes\"},{\"Identifier\":\"0f2c476d-ca85-4890-b36f-03109a4f1f4d\",\"Parameters\":{\"ComparisonValue\":\"$.External.lambdaResult\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"b72bc9a7-c671-414d-a780-f27ddbe2805a\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"Success\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"7b1b04f8-fa4b-4146-b567-0ff27c0c7d56\",\"Parameters\":{\"ComparisonValue\":\"$.Attributes.hasAppointment\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"c533e8bb-e1a4-4df0-9910-765e1684dff6\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"1\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"c4a670f1-01cc-4f57-952c-b5ce1cb8acdd\",\"Parameters\":{\"ComparisonValue\":\"$.Channel\"},\"Transitions\":{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"Errors\":[{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"a123b218-b7e0-4531-93df-c724c3dbf2e6\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"TASK\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"a123b218-b7e0-4531-93df-c724c3dbf2e6\",\"Parameters\":{\"Attributes\":{\"hasAppointment\":\"$.Attributes.IsOnlineAppoinment\"}},\"Transitions\":{\"NextAction\":\"7b1b04f8-fa4b-4146-b567-0ff27c0c7d56\",\"Errors\":[{\"NextAction\":\"7b1b04f8-fa4b-4146-b567-0ff27c0c7d56\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[]},\"Type\":\"UpdateContactAttributes\"},{\"Identifier\":\"b9995749-67df-4fd5-9859-4a6e512b4f35\",\"Parameters\":{\"QueueTimeAdjustmentSeconds\":\"1800\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[],\"Conditions\":[]},\"Type\":\"UpdateContactRoutingBehavior\"},{\"Identifier\":\"3ce966a6-a751-4a72-892c-11c259513d47\",\"Parameters\":{\"TimeLimitSeconds\":\"$.External.delta\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingError\"}],\"Conditions\":[{\"NextAction\":\"b9995749-67df-4fd5-9859-4a6e512b4f35\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"WaitCompleted\"]}}]},\"Type\":\"Wait\"},{\"Identifier\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Parameters\":{\"ComparisonValue\":\"$.Attributes.testType\"},\"Transitions\":{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"Errors\":[{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"a20018d2-663c-464e-abe7-275c02ed00af\",\"Condition\":{\"Operator\":\"TextContains\",\"Operands\":[\"General\"]}},{\"NextAction\":\"2a46e47c-5957-4e98-a1e4-dcffa169a84b\",\"Condition\":{\"Operator\":\"TextContains\",\"Operands\":[\"Genetic\"]}},{\"NextAction\":\"02aeee64-9212-404b-98a6-7f8692ff77f5\",\"Condition\":{\"Operator\":\"TextContains\",\"Operands\":[\"Naturopathic\"]}},{\"NextAction\":\"bbc25229-b243-4f8a-b635-5b10111292d3\",\"Condition\":{\"Operator\":\"TextContains\",\"Operands\":[\"Heart\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"b72bc9a7-c671-414d-a780-f27ddbe2805a\",\"Parameters\":{\"ComparisonValue\":\"$.External.recordFound\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"1feef092-ada4-4f41-bc58-8360df20168f\",\"Condition\":{\"Operator\":\"Equals\",\"Operands\":[\"True\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"1feef092-ada4-4f41-bc58-8360df20168f\",\"Parameters\":{\"ComparisonValue\":\"$.External.delta\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"c60d7873-0723-4670-9540-48cc645d6ae6\",\"Condition\":{\"Operator\":\"NumberGreaterThan\",\"Operands\":[\"0\"]}}]},\"Type\":\"Compare\"},{\"Identifier\":\"c60d7873-0723-4670-9540-48cc645d6ae6\",\"Parameters\":{\"ComparisonValue\":\"$.External.delta\"},\"Transitions\":{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"Errors\":[{\"NextAction\":\"44089a9e-53aa-419d-ac08-1df1bcea3cd3\",\"ErrorType\":\"NoMatchingCondition\"}],\"Conditions\":[{\"NextAction\":\"3ce966a6-a751-4a72-892c-11c259513d47\",\"Condition\":{\"Operator\":\"NumberLessThan\",\"Operands\":[\"15\"]}}]},\"Type\":\"Compare\"}]}',
                                                    InstanceId: process.env.CONNECT_INSTANCE_ID,
                                                    Name: event.ResourceProperties.CONTACT_FLOW_NAME,
                                                    Type: 'CONTACT_FLOW',
                                                    Description: 'Tasks Blog - Contact Flow',
                                                };
                                                connect.createContactFlow(params, function (err, data) {
                                                    if (err) {
                                                        responseData = {
                                                            Error: 'Create Contact Flow operation failed'
                                                        };
                                                        console.log(err, err.stack); // an error occurred
                                                        sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                                                    }
                                                    else {
                                                        responseData.contactFlowArn = data.ContactFlowArn;
                                                        responseData.contactFlowId = data.ContactFlowId;
                                                        console.log(JSON.stringify(data));           // successful response
                                                        responseStatus = 'SUCCESS';
                                                        sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
                                                        callback(null, responseData);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
        responseStatus = 'SUCCESS';
        sendResponse(event, callback, context.logStreamName, responseStatus, responseData);
    }
};

/**
* Sends a response to the pre-signed S3 URL
*/
let sendResponse = function (event, callback, logStreamName, responseStatus, responseData) {
    const responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: `See the details in CloudWatch Log Stream: ${logStreamName}`,
        PhysicalResourceId: logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData,
    });
    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'Content-Type': '',
            'Content-Length': responseBody.length,
        }
    };
    const req = https.request(options, (res) => {
        callback(null, 'Successfully sent stack response!');
    });
    req.on('error', (err) => {
        console.log('sendResponse Error:\n', err);
        callback(err);
    });
    req.write(responseBody);
    req.end();
};