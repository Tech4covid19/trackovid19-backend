'use strict'

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION_SNS,
  accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY
});

function storeS3 (file, fileName) {
    AWS.config.update({region: process.env.AWS_REGION_S3})
    const s3 = new AWS.S3({apiVersion: '2006-03-01'})
    // call S3 to retrieve upload file to specified bucket
    const uploadParams = {Bucket: process.env.AWS_S3_BUCKET, Key: '', Body: ''}

    // Configure the file stream and obtain the upload parameters
    const fs = require('fs')
    const fileStream = fs.createReadStream(file)
    fileStream.on('error', function (err) {
        console.log('File Error', err)
    })
    uploadParams.Body = fileStream
    uploadParams.Key = fileName

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log('Error on s3 upload: ', err)
        }
        if (data) {
            console.log('Upload Success', data.Location)
            return data.Location
        }
    })
}

function publish (message) {
    var params = {
        Message: message,
        TopicArn: process.env.AWS_SNS_TOPICARN,
    }

    return new AWS.SNS().publish(params).promise()
}

module.exports = {
    SNS: {
        publish,
    },
    S3: {
        storeS3,
    },
};
