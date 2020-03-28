'use strict'

const webpush = require('web-push');

function sendNotification(subscription, title, body) {
  return new Promise(function(resolve, reject) {
    try {
      const payload = JSON.stringify({
        title: title,
        body: body
      });

      webpush.setGCMAPIKey(process.env.GCM_API_KEY);
      //console.log(webpush.generateVAPIDKeys());
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      // const options = {
      //   TTL: 0 // Time to live 
      // };

      webpush.sendNotification(subscription, payload) //, options)
      .then(function() {
        resolve();
      }).catch(function(e) {
        reject(e);
      });
    } catch(e) {
      reject(e);
    }
  });
}

exports.sendNotification = sendNotification;