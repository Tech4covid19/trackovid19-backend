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

function publish (message, topic_arn) {
    var params = {
        Message: message,
        TopicArn: topic_arn,
    }

    return new AWS.SNS().publish(params).promise();
}

function send(to, subject, message) {
    // Create sendEmail params 
    var params = {
        Destination: { 
            ToAddresses: [
                to
            ]
        },
        Message: { 
            Body: { 
                Html: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: 'info@covidografia.pt',
        ReplyToAddresses: [
            'info@covidografia.pt'
        ],
  };
  
  // Create the promise and SES service object
  return new AWS.SES({apiVersion: '2012-10-17'}).sendEmail(params).promise();
}

function sendDeletionConfirmationEmail(to) {
    const subject = 'Confirmação de eliminação de dados';
    const message = 'Obrigado por ter usado a Covidografia.<br/><br/>Como requerido por si, procedemos à eliminação de todos os seus dados. O seu email será eliminado imediatamente após o envio desta mensagem.<br/><br/>Se tiver alguma sugestão de melhoria da Covidografia, agradecemos se nos puder enviar por email para <a href="mailto:info@covidografia.pt">info@covidografia.pt</a>.<br/><br/>Obrigado,<br/>A equipa da Covidografia';
    let promise = send(to, subject, message);

    console.log('Sending email...');

    // Handle promise's fulfilled/rejected states
    promise.then(
    function(data) {
        console.log('Deletion confirmation email sent', data.MessageId);
    }).catch(
        async function(err) {
            console.error('Error sending deletion confirmation email', err);

            // Send a message to the SNS to keep track on the errors
            try {
                const data = await publish(JSON.stringify(err), process.env.AWS_SNS_FAIL_EMAIL_TOPICARN);
              }
              catch(err) {
                console.log('Unable to publish message on topic', err);
              }

        }
    );
    
}



module.exports = {
    SNS: {
        publish,
    },
    S3: {
        storeS3,
    },
    SES: {
        send,
        sendDeletionConfirmationEmail
    }
};
