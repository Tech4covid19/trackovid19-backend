const crypto = require('crypto');

//
// Crypto functions
//

generate_random = (size) => {
    return crypto.randomBytes(size).toString('hex');
};

generate_keys_hex = () => {
    return {
        key: generate_random(32)
    };
};

generate_iv = () => {
    return generate_random(16);
};

read_keys = (iv) => {
    let key = Buffer.from(`${process.env.AES_256_KEY}`, 'hex'); 
    iv = Buffer.from(iv, 'hex'); 
    return {
        key: key,
        iv: iv
    };
};

encrypt = (plaintext, key, iv) => { 
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv); 
    let encrypted = cipher.update(plaintext); 
    encrypted = Buffer.concat([encrypted, cipher.final()]); 
    
    return encrypted.toString('hex');
};

decrypt = (encrypted, key, iv) => { 
    let encryptedText = Buffer.from(encrypted, 'hex'); 
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv); 
    let decrypted = decipher.update(encryptedText); 
    decrypted = Buffer.concat([decrypted, decipher.final()]); 
    return decrypted.toString(); 
}; 

encrypt_payload = (payload, iv) => {
    let keys = read_keys(iv);
    return encrypt(JSON.stringify(payload || {}), keys.key, keys.iv);
};

decrypt_payload = (payload, iv) => {
    let keys = read_keys(iv);
    return JSON.parse(decrypt(payload, keys.key, keys.iv));
};

//
// Hash with salt
makeHash = (plaintext, salt) => {
    return crypto.createHmac('sha256', salt).update(plaintext).digest('hex');
};

//
// Make the salt for the given message.
// We'll use only a part of the message letters for the salt by starting
// at index 'start', and advancing 'step' positions between each letter.
// Ex. use start=0 and step=2 for picking all odd letters
//     use start=1 and step=2 for picking all even letters
//
makeSalt = (message, start, step) => {

    var salt = "";
    const letters = message.split("");
    for (var i = start; i < letters.length; i += step) {
        salt = salt.concat(letters[i]);
    }

    return salt;
};

//
// Generates two hashes: one to be used for the personal info and another one 
// for the healh info
//

generateIdentityProviderHashes = (provider, id) => {
  // Personal hash
  const salt_personal = makeSalt(id, 0, 2);
  const personal = makeHash(identityProviderMessageToHash(provider, id), salt_personal);

  // Health hash
  const salt_health = makeSalt(id, 1, 2);
  const health = makeHash(identityProviderMessageToHash(provider, id), salt_health);

  return {personal: personal, health: health};
};

//
// Make sure we avoid clashes with ids from other providers
//

identityProviderMessageToHash = (provider, id) => {
  return `${provider}:${id}`;
}


//
// Info structure
//

buildInfo = (name, email, phone) => {
    info = {
        version: 1,
        name: name,
        email: email,
        phone: phone
    }
    return info;
}

//
// Splits the postal code into its parts
//
splitPostalCode = (postalCode) => {
    const postparts = (postalCode !== undefined ? postalCode : '0000-000').match(/([0-9]{4})-([0-9]{3})/);
    const parts = postparts.length == 3 ? postparts.slice(1, 3) : [undefined, undefined];
    return parts;
} ;

buildPostalCode = (postalcode1, postalcode2) => {
    const pc1 = postalcode1 != null ? postalcode1 : '0000';
    const pc2 = postalcode2 != null ? postalcode2 : '000';
    return `${pc1}-${pc2}`;
} ;

//
// Sanitize logs
//

sanitize_log = (error, message) => {
    const error_id = generate_random(4);
    const msg = `ERROR|${error_id}|${message || "-"}|`;
    console.log(msg, error);
    return {
        error: message || 'An unexpected error has occurred.',
        error_id: error_id
    };
}

// Exports
exports.generateIdentityProviderHashes = generateIdentityProviderHashes;
exports.buildInfo = buildInfo;
exports.splitPostalCode = splitPostalCode;
exports.buildPostalCode = buildPostalCode;
exports.encrypt_payload = encrypt_payload;
exports.decrypt_payload = decrypt_payload;
exports.generate_keys_hex = generate_keys_hex;
exports.generate_iv = generate_iv;
exports.generate_random = generate_random;
exports.sanitize_log = sanitize_log;