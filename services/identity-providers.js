'use strict'

const { v4: uuidv4 } = require('uuid');
const tools = require('../tools/tools');

async function getJwtWithProviderCodeFlow(provider, request) {
  const fastify = this;
  return new Promise(function(resolve, reject) {
    try {
      fastify[`${provider.name}OAuth2`].getAccessTokenFromAuthorizationCodeFlow(request, async (err, token) => {
        if (err) {
          reject(err);
        } else {
          if (!token) {
            resolve(null);
          }
          else {
            const jwt = await getJwtWithProviderToken.call(fastify, provider, token);
            resolve(jwt);
          }
        }
        
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getJwtWithProviderToken(provider, token) {
  try {
    const { data: { id, name, email }, status } = await this.axios.get(provider.userInfoUrl, { headers: { Authorization: `Bearer ${token.access_token}` } });
    
    // Let's generate the hashes
    const hashes = tools.generateIdentityProviderHashes(provider.name, id);

    // Let's look for a user in the health data model
    let user = await this.models().Users.findOne({
      where: { external_id: hashes.health }
    });

    if (!user) {
      user = await this.models().Users.create({
        external_id: hashes.health,
        external_id_provider_id: provider.id,
        last_login: new Date()
      }, { fields: ['external_id', 'external_id_provider_id', 'last_login'] }
      );
    }
    else {
      // Update the user info
      user.last_login = new Date();
      await user.save();
    }

    // Now let's look for the user in the personal data model
    let personal = await this.models().UsersData.findOne({
        where: { external_id: hashes.personal }
    });

    if (!personal) {
      const personal_id = uuidv4();
      personal = await this.models().UsersData.create({
        id: personal_id,
        external_id: hashes.personal,
        external_id_provider_id: provider.id,
        name: name,
        email: email
      }, { fields: ['id', 'external_id', 'external_id_provider_id', 'name', 'email'] }
      );
    }
    else {
      // Update the personal info
      personal.name = name;
      personal.email = email;
      await personal.save();
    }

    // Generate the JWT token
    let iv = tools.generate_iv();
    let payload = tools.encrypt_payload({
      id: user.id,
      id_data: personal.id,
      name: name
    }, iv);
    const jwt = await this.jwt.sign({
      payload: payload,
      session: iv,
      roles: ['user']
    });
    // send redirect
    //reply.redirect(`${process.env.AFTER_LOGIN_CALLBACK_URL}/#/post-code?code=${jwt}&state=${request.query.state}&provider=${provider.id}`);
    return jwt;

  } catch (error) {
    throw error;
  }

}

const providers = {
  facebook: 1,
  google: 2
}
providers.nameById = (id) => {
  if (id === 1) {
    return 'facebook';
  }
  if (id === 2) {
    return 'google';
  }
  return 'unknown';
};

function providerByName(name) {
  const providerId = providers[name.toLowerCase()];
  const providerName = providers.nameById(providerId);
  const userInfoUrl = providerId === 1 ? process.env.FB_USER_INFO_URL : providerId === 2 ? process.env.GOOGLE_USER_INFO_URL : '';

  return !providerId ? null : {
    id: providerId,
    name: providerName,
    userInfoUrl: userInfoUrl
  };
}

exports.getJwtWithProviderCodeFlow = getJwtWithProviderCodeFlow;
exports.getJwtWithProviderToken = getJwtWithProviderToken;
exports.providers = providers;
exports.providerByName = providerByName;