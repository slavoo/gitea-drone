const request = require('request');
const url = require('url');

const droneUrl = process.env.DRONE_URL;
if (droneUrl === undefined) throw new Error("DRONE_URL environment variable must be set.");

const token = process.env.DRONE_TOKEN;
if (token === undefined) throw new Error("DRONE_TOKEN environment variable must be set.");

// const droneUrl = 'https://ci.genis.slavoo.local';
// const token = 'C9isOU5zIj0WlRGDNxHaeGmFuGPDkbew';

function refreshRepos(callback) {
    request.post(url.resolve(droneUrl, `/api/user/repos`))
        .auth(bearer = token)
        .on('response', (r1) => {
            callback();
        });
}
let client = {
    activateRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.post(url.resolve(droneUrl, `/api/repos/${fullName}`))
                .auth(bearer = token)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message))
        );
    },
    deleteRepo: function (fullName, callback, errorCallback) {
        refreshRepos(
            () => request.delete(url.resolve(droneUrl, `/api/repos/${fullName}`))
                .auth(bearer = token)
                .on('response', (resp) => { callback(); })
                .on('error', (eResp) => errorCallback(eResp.message))
        );
    }
}

module.exports = client;