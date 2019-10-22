import express from 'express';
import { Server } from 'http';

export enum HttpAction {
    Post = "POST",
    Delete = "DELETE"
}

export class FakeDroneServer {

    public app = express();
    public runningApp: Server;

    public callbacks: {
        [id: string]:
        {
            callCount: number,
            callback: (req: express.Request, res: express.Response) => void
        }
    } = {};

    constructor() {

        this.app.post('/api/repos/:owner/:repo', (req, res) => {
            this.onRequest(HttpAction.Post, req.params.owner, req.params.repo, req, res);
        });

        this.app.delete('/api/repos/:owner/:repo', (req, res) => {
            this.onRequest(HttpAction.Delete, req.params.owner, req.params.repo, req, res);
        });


        this.app.post('/api/user/repos', (req, res) => {
            res.sendStatus(200);
        });

        this.app.use((req, res, next) => {
            res.status(404).send({
                status: 404,
                message: `Not Found: (${req.method}) ${req.url}`
            });
        });
    }

    public expect(action: string, owner: string, repo: string, callback: (req: express.Request, res: express.Response) => void) {
        this.callbacks[this.toMockCode(action, owner, repo)] = {
            callCount: 0,
            callback
        }
    }

    public getCallCount(action: string, owner: string, repo: string): number {
        const mockCode = this.toMockCode(action, owner, repo);
        const callStats = this.callbacks[mockCode];

        if (!callStats) { throw new Error(`No mock callback registered for ${mockCode}`) }

        return callStats.callCount;
    }

    public start(port: number): void {
        if (this.runningApp) { throw new Error("Server is already running."); }

        this.runningApp = this.app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }

    public close() {
        if (!this.runningApp) { throw new Error("Server is not running."); }

        this.runningApp.close();

        this.runningApp = null;
    }

    private toMockCode(action: string, owner: string, repo: string): string {
        return `${action}:${owner}/${repo}`;
    }

    private onRequest(action: HttpAction, owner: string, repo: string, req: express.Request, res: express.Response) {
        const mockCode = this.toMockCode(action, owner, repo);
        const callMock = this.callbacks[mockCode];

        if (!callMock) {
            res.status(500).send({ code: 500, message: `No mock callback registered for ${mockCode}` });
            return;
        }

        callMock.callCount++;

        callMock.callback(req, res);
    }
}
