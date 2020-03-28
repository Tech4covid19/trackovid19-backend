'use strict'

const webPush = require('../../../services/web-push-service');

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
    const subscription = request.body.subscription;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      reply.status(500).send({
        error: 'Missing payload data'
      });
      return;
    }

    try {
      // get user subscription
      let pushSubscription = await fastify.models().PushSubscriptions.findOne({
        where: { 
          user_id: request.user.payload.id, 
          push_type: 'web-push', 
          endpoint: subscription.endpoint 
        }
      });

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

    reply.send({ status: 'ok' });
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
            await webPush.sendNotification(subscription, request.body.title, request.body.body);
            console.log('Web Push Application Server - Notification sent to ' + subscription.endpoint);
            sends.push(subscription.endpoint);
          } catch (error) {
            console.log('ERROR in sending Notification to ' + subscription.endpoint);
            console.log(error);
            request.log.error(error)
            // to update or not update the send_error_count in push_subscriptions table ?!
            reply.status(500).send({
              error: 'Error in sending Notification'
            });
            return;
          }
        }
        return {
          notifications: {
            available: pushSubscriptions.length,
            sent: sends.length
          }
        }
      } else {
        reply.status(404).send({ error: "No subscriptions for user" });
      }
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        error
      });
    }

  });

}