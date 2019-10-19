const request = require('request');
const url = require('url');
const { DRONE_URL, DRONE_TOKEN } = require('../config')

function refreshRepos(callback, errorCallback) {
    request.post(url.resolve(DRONE_URL, `/api/user/repos`))
        .auth(bearer = DRONE_TOKEN)
        .on('response', resp => {
            successOrFaiulre(resp, callback, errorCallback);
        })
        .on('error', (err) => { errorCallback(err.message); });
}

function successOrFaiulre(res, successCallback, errorCallback) {
    if (res.statusCode >= 400) {
        console.error(res.statusCode);
        console.error(res.body);
        errorCallback(JSON.stringify(res.body));
        return;
    }

    successCallback();
    return;
}

let client = {
    activateRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.post(url.resolve(DRONE_URL, `/api/repos/${fullName}`))
                .auth(bearer = DRONE_TOKEN)
                .on('response', (resp) => { successOrFaiulre(resp, callback, errorCallback); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    },
    deleteRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.delete(url.resolve(DRONE_URL, `/api/repos/${fullName}`))
                .auth(bearer = DRONE_TOKEN)
                .on('response', (resp) => { successOrFaiulre(resp, callback, errorCallback); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    }
}

module.exports = client;