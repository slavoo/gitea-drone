const request = require('request');
const url = require('url');

const droneUrl = process.env.DRONE_URL;
if (droneUrl === undefined) throw new Error("DRONE_URL environment variable must be set.");

const token = process.env.DRONE_TOKEN;
if (token === undefined) throw new Error("DRONE_TOKEN environment variable must be set.");

function refreshRepos(callback, errorCallback) {
    request.post(url.resolve(droneUrl, `/api/user/repos`))
        .auth(bearer = token)
        .on('response', (r1) => { callback(); })
        .on('error', (err) => { errorCallback(err.message); });
}
let client = {
    activateRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.post(url.resolve(droneUrl, `/api/repos/${fullName}`))
                .auth(bearer = token)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    },
    deleteRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.delete(url.resolve(droneUrl, `/api/repos/${fullName}`))
                .auth(bearer = token)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    }
}

module.exports = client;