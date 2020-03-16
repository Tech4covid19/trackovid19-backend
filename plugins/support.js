'use strict'

const fp = require('fastify-plugin')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const crypto = require('crypto');
const lockfile = require('proper-lockfile');
const fs = require('fs');

module.exports = fp(async (fastify, opts) => {
  fastify.decorate('bcrypt', () => {
    return bcrypt
  })

  fastify.decorate('genUnique', (size = 9) => {
    const posI = Math.floor(Math.random() * 10);
    const seed = crypto.createHash('sha256').update(uuid() + Date.now() + posI, 'utf8').digest('hex').substring(0, size);
    const pos = Math.floor(Math.random() * (seed.length + 1));
    const randChar = Math.floor(Math.random() * 2);
    const val = `${seed.substr(0, pos)}${randChar === 0 ? '-' : '_'}${seed.substr(pos)}`;
    return val
  })
})