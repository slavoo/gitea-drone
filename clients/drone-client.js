const request = require('request');
const url = require('url');
const { DRONE_URL, DRONE_TOKEN } = require('../config')

function refreshRepos(callback, errorCallback) {
    request.post(url.resolve(DRONE_URL, `/api/user/repos`))
        .auth(bearer = DRONE_TOKEN)
        .on('response', (r1) => { callback(); })
        .on('error', (err) => { errorCallback(err.message); });
}
let client = {
    activateRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.post(url.resolve(DRONE_URL, `/api/repos/${fullName}`))
                .auth(bearer = DRONE_TOKEN)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    },
    deleteRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.delete(url.resolve(DRONE_URL, `/api/repos/${fullName}`))
                .auth(bearer = DRONE_TOKEN)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    }
}

module.exports = client;