module.exports = [{
  script: 'app.js',
  name: 'covidografia-backend',
  exec_mode: 'cluster',
  instances: 'max',
  env: {
    "NODE_ENV": "production",
  }
}]
