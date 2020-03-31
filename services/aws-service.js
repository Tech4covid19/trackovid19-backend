'use strict'

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION_SNS,
  accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY
});

function publish(message) {
  var params = {
    Message: message,
    TopicArn: process.env.AWS_SNS_TOPICARN
  };
  
  return new AWS.SNS().publish(params).promise();
}

module.exports = {
  SNS: {
    publish
  }
};