


stringifyInfo = (info) => {
    return JSON.stringify(info);
};

parseInfo = (info) => {
    return (info != undefined && info != null) ? JSON.parse(info) : {};
};

buildInfo = (name, email, phone) => {
    info = {
        version: 1,
        name: name,
        email: email,
        phone: phone
    }
    return info;
}

buildAndStringifyInfo = (name, email, phone) => {
    return stringifyInfo(buildInfo(name, email, phone));
};

updateInfo = (info, name, email, phone) => {
    info.version = 1
    info.name = name !== undefined ? name : info.name;
    info.phone = phone !== undefined ? phone : info.phone;
    info.email = email !== undefined ? email : info.email;
    return info;
};

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


// Exports
exports.stringifyInfo = stringifyInfo;
exports.parseInfo = parseInfo;
exports.buildInfo = buildInfo;
exports.buildAndStringifyInfo = buildAndStringifyInfo;
exports.updateInfo = updateInfo;
exports.splitPostalCode = splitPostalCode;
exports.buildPostalCode = buildPostalCode;