'use strict'

const fp = require('fastify-plugin')
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
    let integrityChar = sum % 10;
    /*
      If integrity char is 0 we change it to 1.
      This is to avoid confusion between 0 and O.
    */
    if (integrityChar === 0) {
        integrityChar++
    }
    return `${integrityChar}`;
  }

  fastify.decorate('genPatientToken', () => {
    const allowedChars = 'ABCDEFGHKMNPRSTUVXZ123456789';
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
    const generatedIntegrityChar = generateIntegrityChar(randomString);
    // compare input integrity char with the one generated
    if (integrityChar !== generatedIntegrityChar) {
      return false;
    }
    return true;
  })
})
