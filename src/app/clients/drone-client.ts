import * as request from 'request';
import url from 'url';
import { DRONE_URL, DRONE_TOKEN } from '../config';

export class DroneClient {

    public activateRepo(fullName: string, callback: () => void, errorCallback: (msg: string) => void) {
        this.refreshRepos(
            () => request.post(url.resolve(DRONE_URL, `/api/repos/${fullName}`), { auth: { bearer: DRONE_TOKEN } })
                .on('response', (resp) => { this.successOrFaiulre(resp, callback, errorCallback); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    }

    public deleteRepo(fullName: string, callback: () => void, errorCallback: (msg: string) => void) {
        this.refreshRepos(
            () => request.delete(url.resolve(DRONE_URL, `/api/repos/${fullName}`), { auth: { bearer: DRONE_TOKEN } })
                .on('response', (resp) => { this.successOrFaiulre(resp, callback, errorCallback); })
                .on('error', (eResp) => errorCallback(eResp.message)),
            (error) => errorCallback(error)
        );
    }

    private refreshRepos(callback: () => void, errorCallback: (msg: string) => void) {
        request.post(url.resolve(DRONE_URL, `/api/user/repos`), { auth: { bearer: DRONE_TOKEN } })
            .on('response', resp => { this.successOrFaiulre(resp, callback, errorCallback); })
            .on('error', (err) => { errorCallback(err.message); });
    };

    private successOrFaiulre(res: request.Response, successCallback: () => void, errorCallback: (msg: string) => void) {
        if (res.statusCode >= 400) {
            console.error(res.statusCode);
            console.error(res.body);
            errorCallback(JSON.stringify(res.body));
            return;
        }

        successCallback();

        return;
    };
}
