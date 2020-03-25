'use strict'

const webpush = require('web-push');

let subscription;

module.exports = async (fastify, opts) => {

  fastify.get('/push/web/vapidPublicKey',  {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['user'],
    }
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
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    subscription = request.body.subscription;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      reply.status(500).send({
        error: 'Missing payload data'
      });
      return;
    }

    let pushSubscription;

    try {
      pushSubscription = await getUserPushSubscription(request.user.payload.id, subscription.endpoint);

      if (!pushSubscription) {
        pushSubscription = await fastify.models().PushSubscriptions.create({ 
          user_id: request.user.payload.id,
          push_type: 'web-push',
          endpoint: subscription.endpoint,
          keys: JSON.stringify(subscription.keys),
          send_error_count: 0
          }, { fields: ['user_id', 'push_type', 'endpoint', 'keys', 'send_error_count'] }
        );
      }
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }

    subscription = request.body.subscription;
    console.log(subscription);
    return {};
  });

  fastify.post('/push/web', {
    preValidation: [fastify.authenticate]
  }, async (request, reply) => {
    
    if (!request.body || !request.body.user_id || !request.body.title || !request.body.body) {
      reply.status(500).send({
        error: 'Missing payload data'
      });
      return;
    }

    let sends = [];
    let pushSubscriptions;
    try {
      pushSubscriptions = await fastify.models().PushSubscriptions.findAll({
        where: { 
          user_id: request.body.user_id, 
          push_type: 'web-push'
        }
      });

      if (pushSubscriptions) {
        for (const pushSub of pushSubscriptions) {
          const subscription = {
            endpoint: pushSub.endpoint,
            keys: JSON.parse(pushSub.keys)
          };
          try {
            await sendNotification(subscription, request.body.title, request.body.body);
            sends.push(subscription.endpoint);
          } catch (error) {
            // to update or not update the send_error_count in push_subscriptions table ?!
          }
        }
        return {
          notifications: {
            available: pushSubscriptions.length,
            sent: sends.length
          }
        }
      } else {
        reply.status(200).send({
          message: 'No subscriptions for user'
        });
      }
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }

  });

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
          console.log('Web Push Application Server - Notification sent to ' + subscription.endpoint);
          resolve();
        }).catch(function(e) {
          console.log('ERROR in sending Notification to ' + subscription.endpoint);
          // delete subscriptions[subscription.endpoint];
          reject(e);
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  async function getUserPushSubscription(userId, endpoint) {
    return await fastify.models().PushSubscriptions.findOne({
      where: { 
        user_id: userId, 
        push_type: 'web-push', 
        endpoint: endpoint 
      }
    });
  }
}