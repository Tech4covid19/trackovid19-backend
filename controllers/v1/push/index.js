'use strict'

const webpush = require('web-push');

let subscription;

module.exports = async (fastify, opts) => {

  fastify.get('/push/web/vapidPublicKey',  {
  }, async (request, reply) => {
    try {
      return {
        publicKey: process.env.VAPID_PUBLIC_KEY
      };
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  });

  fastify.post('/push/web/register', {
  }, async (request, reply) => {
    subscription = request.body.subscription;
    console.log(subscription);
    return 'done';
  });

  fastify.post('/push/web', {
  }, async (request, reply) => {
    
    if (!request.body || !request.body.title || !request.body.body) {
      reply.status(500).send({
        message: 'Missing payload'
      });
    }

    let payload = JSON.stringify({
      title: request.body.title,
      body: request.body.body
    });

    try {
      webpush.setGCMAPIKey(process.env.GCM_API_KEY);
      //console.log(webpush.generateVAPIDKeys());
      webpush.setVapidDetails(
        'http://localhost:3000/',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      const options = {
        TTL: 0 // Time to live
      };

      webpush.sendNotification(subscription, payload, options)
      .then(function() {
        console.log('Push Application Server - Notification sent to ' + subscription.endpoint);
        reply.status(200).send({});
      }).catch(function(e) {
        console.log('ERROR in sending Notification, endpoint removed ' + subscription.endpoint);
        // delete subscriptions[subscription.endpoint];
        throw e;
      });

    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }
  });
}