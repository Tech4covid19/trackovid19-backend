'use strict'

const path = require('path');
const Sequelize = require('sequelize');
const webPush = require('../services/web-push-service');

// store application root
global.__basedir = __dirname

require('dotenv').config({ path: path.resolve(global.__basedir, '../.env') })

const sequelizeConfig = {
  instance: 'sequelize',
  autoConnect: true,
  dialect: 'postgres',
  timezone: 'utc',
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
  pool: {
    max: 100,
    min: 1,
    acquire: 30000,
    idle: 10000
  },
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false
}

const subscriptionsToSend = `select 
push_subscriptions.id as push_subscriptions_id
,push_subscriptions.user_id
,push_subscriptions.endpoint
,push_subscriptions.keys
from latest_status, push_subscriptions
where 
latest_status.user_id = push_subscriptions.user_id
and push_subscriptions.push_type = 'web-push'
and latest_status.timestamp <= CURRENT_TIMESTAMP + interval '-24h'`;

function connectToDB(options) {
  return new Promise((resolve, reject) => {
    const sequelize = new Sequelize(options);
    if (options.autoConnect) {
      sequelize
      .authenticate()
      .then(() => {
          console.info('Connection has been established successfully.')
          return resolve(sequelize)
      })
      .catch(err => {
          console.error('Unable to connect to the database:', err)
          return reject(err)
      })
    } else {
      return resolve(sequelize)
    }
  })
}

async function runJob() {
  try {
    const sequelize = await connectToDB(sequelizeConfig);

    const notificationCode = 'users-no-update-24h';
    const notDB = await sequelize.query('select * from public.notifications where code = :p_code', 
            {replacements: { p_code: notificationCode }, type: sequelize.QueryTypes.SELECT});

    if (!notDB || !notDB.length) {
      console.log(`Notification '${notificationCode}' data not available in database.`);
    } else {

      let notification = {
        title: notDB[0].title,
        body: notDB[0].body
      };

      if (notDB[0].options) {
        notification = Object.assign(notification, JSON.parse(notDB[0].options));
      }

      const pushSubscriptions = await sequelize.query(subscriptionsToSend, { type: sequelize.QueryTypes.SELECT});

      let sends = [];
      let expired = [];

      if (pushSubscriptions) {
        for (const pushSub of pushSubscriptions) {
          const subscription = {
            endpoint: pushSub.endpoint,
            keys: JSON.parse(pushSub.keys)
          };
          try {
            await webPush.sendNotification(subscription, notification);

            console.log('Web Push Application Server - Notification sent to ' + subscription.endpoint);
            sends.push(subscription.endpoint);
          }
          catch (error) {
            console.log('ERROR in sending Notification to ' + subscription.endpoint);
            console.log(error);
            
            if (error.statusCode === 410) {
              // push subscription has unsubscribed or expired
              expired.push(subscription.endpoint);
              // delete subscription from DB
              await sequelize.query(`delete from push_subscriptions where id = ${pushSub.push_subscriptions_id}`);
              console.log(`Subscription ${pushSub.push_subscriptions_id} deleted from DB because has unsubscribed or expired`);
            }
          }
        }
      }

      console.log('Result', {
        available: pushSubscriptions.length,
        sent: sends.length,
        expired: expired.length
      });

    }

    console.info('Closing connection to database.');
    await sequelize.close();
    console.info('Connection closed.');
    console.log('Job notify-users-no-update-24h completed');

  } catch(err) {
    console.log('Error running job notify-users-no-update-24h', err);
  }
}

// Support for AWS Lambda
if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
  module.exports.handler = runJob;
} else {
  console.log(`Running job notify-users-no-update-24h`);
  runJob();
}