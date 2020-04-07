'use strict'

// Special thanks to @victorfern91 @hugoduraes @ludwig801 @palminha @zepcp @lcfb91 @jcazevedo @cchostak for the work and efforts to bootstrap this service!
// Feel free to change / improve / delete everything you want!

const fastify = require('fastify')({logger: false})
const path = require('path')
const AutoLoad = require('fastify-autoload')
const fsequelize = require('fastify-sequelize')
const oauthPlugin = require('fastify-oauth2')
const oas = require('fastify-oas')
const swagger = require('./config/swagger')
// store application root
global.__basedir = __dirname



fastify.register(oas, swagger.options)

const dotEnv = require('dotenv').config()

const sequelizeConfig = {
    instance: 'sequelize',
    autoConnect: true,
    dialect: 'postgres',
    timezone: 'utc',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },
    pool: {
        max: 100,
        min: 1,
        acquire: 30000,
        idle: 10000,
    },
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false
}

/*
fastify.register(
  require('fastify-rate-limit'), {
  max: 60,
  timeWindow: '1 minute'
})
*/

fastify.register(
  require('fastify-helmet'), {
  hidePoweredBy: {
    setTo: 'Covidografia API Server'
  }
})


fastify
  .register(fsequelize, sequelizeConfig)
  .ready((err) => {
    if (!err) {
      fastify.setupModels();
    } else {
      console.log("ERROR registering sequelize ", err);
      throw err;
    }
  })

const corsOptions = {
  origin: process.env.CORS_ORIGIN.split(','),
  methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200 // to support some legacy browsers
}

fastify.use(require('cors')(corsOptions))

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  //options: Object.assign({}, opts)
})

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'controllers/v1'),
  options: Object.assign({}, { prefix: '/api/v1' })
})

if (process.env.PRODUCTION != '1') {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  });
}

fastify.register(require('fastify-axios'))

fastify.register(oauthPlugin, {
  name: 'facebookOAuth2',
  credentials: {
    client: {
      id: process.env.FB_APP_ID,
      secret: process.env.FB_APP_SECRET
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION
  },
  generateStateFunction: function(){
      //return require('uuid/v4')();
      return require('crypto').randomBytes(10).toString('hex')
  },
  checkStateFunction: function(state, callback){
      callback()
  },
  startRedirectPath: '/login/facebook',
  callbackUri: `${process.env.FB_CALLBACK_URL}/login/facebook/callback`,
  scope: process.env.FB_APP_SCOPE // 'email,public_profile'
})

fastify.register(oauthPlugin, {
  name: 'googleOAuth2',
  credentials: {
    client: {
      id: process.env.GOOGLE_APP_ID,
      secret: process.env.GOOGLE_APP_SECRET
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  generateStateFunction: function(){
      //return require('uuid/v4')();
      return require('crypto').randomBytes(10).toString('hex')
  },
  checkStateFunction: function(state, callback){
      callback()
  },
  startRedirectPath: '/login/google',
  callbackUri: `${process.env.GOOGLE_CALLBACK_URL}/login/google/callback`,
  scope: process.env.GOOGLE_APP_SCOPE // 'profile email openid'
})

// Support for AWS Lambda
if (process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) {
  const serverless = require('serverless-http');
  module.exports.handler = serverless(fastify);
} else {
  fastify.listen(process.env.PORT, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    fastify.oas();
    console.log(`server listening on ${fastify.server.address().port}`);
  })
}



