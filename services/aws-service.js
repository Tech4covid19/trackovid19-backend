'use strict'

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION_SNS,
  accessKeyId: process.env.AWS_SNS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY
});

async function storeS3 (file, fileName) {
    return new Promise(async function (resolve, reject) {
        console.log('started s3 method')
        try {
            AWS.config.update({
                region: process.env.AWS_REGION_S3,
                accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            })
            const s3 = new AWS.S3({apiVersion: '2006-03-01'})

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileName,
                Body: file,
            }

            // call S3 to retrieve upload file to specified bucket
            let data = await s3.upload(uploadParams).promise()
            console.log('will resolve promise', data)
            resolve(data.Key)
        } catch (e) {
            console.log('Error on storeS3:', e)
            reject(e)
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
