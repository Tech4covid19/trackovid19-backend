'use strict'

const fp = require('fastify-plugin')
const uuid = require('uuid');
const crypto = require('crypto');
const lockfile = require('proper-lockfile');
const fs = require('fs');
const cryptoRandomString = require('crypto-random-string');

module.exports = fp(async (fastify, opts) => {
  /*
    (Credits to @pouta 19-03-2020)
    This function generates 9 random chars from allowed chars list.
    To generate integrity char, this function sums each char code of the generated string
    and takes the remainder of sum % 10
  */
  const generateIntegrityChar = (s) => {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += s.charCodeAt(i);
    }
    const integrityChar = sum % 10;
    return integrityChar;
  }

  fastify.decorate('genPatientToken', () => {
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVXZ0123456789';
    const randomString = cryptoRandomString({ length: 9, characters: allowedChars });
    const integrityChar = generateIntegrityChar(randomString);
    const patientToken = `${randomString}${integrityChar}`;
    return patientToken;
  })

  fastify.decorate('validatePatientToken', (patientToken) => {
    // isolate random part
    const randomString = patientToken.slice(0, -1);
    // isolate integrity check
    const integrityChar = patientToken[patientToken.length - 1];
    //generate sum of all chars in random part
    const sum = generateIntegrityChar(randomString);
    // compare input integrity char with the one generated
    if (integrityChar !== `${sum % 10}`) {
      return false;
    }
    return true;
  })
})